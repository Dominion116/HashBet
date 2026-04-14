# HashBet System Architecture Guide

## Overview
This document explains the four core data flows in HashBet: block hash retrieval, balance display, stats calculation, and withdrawal mechanisms.

---

## 1. Block Hash Fetching & Revelation

### How It Works (On-Chain)

**Flow Diagram:**
```
User places bet → Smart contract records bet for next block → 
Next block is mined → User (or anyone) calls settleBet() → 
Block hash retrieved → First hex char analyzed → 
Winner determined → Payout sent to player
```

### Step-by-Step Breakdown

#### Phase 1: Bet Placement (`placeBet()`)
**Location:** [frontend/src/components/BetPage/index.jsx](frontend/src/components/BetPage/index.jsx#L110-L130)

```javascript
// Frontend calls contract.placeBet(choice === "Big", { value: betWei })
const tx = await contract.placeBet(choice === "Big", {
  value: betWei,
});

const receipt = await tx.wait();
```

**On-Chain (HashBet.sol - line 63-91):**
```solidity
function placeBet(bool _isBig) external payable {
    uint256 betId = totalBetsPlaced++;
    bets[betId] = Bet({
        player: msg.sender,
        amount: msg.value,
        isBig: _isBig,
        blockNumber: block.number + 1,    // ← Points to NEXT block
        blockHash: bytes32(0),             // ← Placeholder (not available yet)
        settled: false,
        won: false,
        timestamp: block.timestamp
    });
    playerBets[msg.sender].push(betId);
    totalPool += msg.value;
    emit BetPlaced(betId, msg.sender, msg.value, _isBig, block.number + 1);
}
```

**Key Point:** The bet references the **next block's number**, not the current block. The block hash is not filled in yet (impossible to know before mining).

#### Phase 2: Block Mining & Waiting
**Location:** [frontend/src/components/BetPage/index.jsx](frontend/src/components/BetPage/index.jsx#L150-L160)

```javascript
let progress = 40;
// Poll until the target block is mined
while ((await provider.getBlockNumber()) <= targetBlock) {
  progress = Math.min(progress + 8, 80);
  setMiningProg(progress);
  await sleep(1800);  // Wait ~2 seconds before checking again
}
```

The frontend polls the blockchain every 1.8 seconds until the target block is mined.

#### Phase 3: Settlement & Block Hash Retrieval
**Location:** [frontend/src/components/BetPage/index.jsx](frontend/src/components/BetPage/index.jsx#L161-L180)

```javascript
// After target block is mined, call settleBet
const settleTx = await contract.settleBet(betId);
await settleTx.wait();

const blockData = await provider.getBlock(targetBlock);
const blockHash = (blockData?.hash || tx.hash).replace(/^0x/i, "").toUpperCase();
// blockHash = "A1F2B3C4D5E6F7... (64 hex chars)"
```

**On-Chain (HashBet.sol - line 96-138):**
```solidity
function settleBet(uint256 _betId) external {
    Bet storage bet = bets[_betId];
    require(!bet.settled, "Already settled");
    require(block.number > bet.blockNumber, "Block not mined yet");

    // ← This is the magic: retrieve the target block's hash
    bytes32 blockHash = blockhash(bet.blockNumber);
    require(blockHash != bytes32(0), "Block hash unavailable");

    bet.blockHash = blockHash;
    bet.settled = true;

    // Extract first hex character (first 4 bits)
    uint8 firstChar = uint8(blockHash[0]) >> 4;
    bool isBig = firstChar >= 8;  // 8-F = Big, 0-7 = Small

    bool won = isBig == bet.isBig;
    bet.won = won;

    if (won) {
        payout = (bet.amount * WIN_MULTIPLIER) / 100;    // 1.88x
        uint256 houseCut = (payout * HOUSE_EDGE_BPS) / 10000;  // 6% cut
        uint256 playerPayout = payout - houseCut;
        
        totalPool -= playerPayout;
        totalBetsWon++;
        
        (bool success, ) = payable(bet.player).call{value: playerPayout}("");
        require(success, "Payout failed");
    }
}
```

### Block Hash Logic Explained

**How the first character is extracted:**
```
Block hash: 0xA1F2B3C4D5E6F7...
Bytes:     [0xA1, 0xF2, 0xB3, ...]
                ^^

uint8(blockHash[0]) = 0xA1
uint8(blockHash[0]) >> 4 = 0x0A = 10 (decimal)

Result: 10 >= 8 → Big ✓
```

**Characters breakdown:**
- Big (8–F): 0x8, 0x9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF
- Small (0–7): 0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7

### Why This Design?

1. **Provably Fair:** Block hashes are immutable, publicly verifiable, and impossible to predict beforehand
2. **Decentralized:** No oracle needed; uses Celo's own blockchain data
3. **Cryptographic Security:** SHA-3 basis makes prediction practically impossible
4. **Transparent:** Winners paid automatically via smart contract logic, no trust required

---

## 2. Wallet Balance Display Issue

### Current State: Hardcoded Value

**Location:** [frontend/src/components/BetPage/AmountInput.jsx](frontend/src/components/BetPage/AmountInput.jsx#L28)

```javascript
<span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.mutedLight }}>
  Balance: 42.00 CELO  ← **HARDCODED, NOT DYNAMIC**
</span>
```

### Why It's Not Showing Real Balance

The balance display is **hardcoded as "42.00 CELO"** instead of fetching the user's actual wallet balance. Here's what needs to be done to fix it:

### Solution: Fetch Real Wallet Balance

**Step 1: Create a hook in [frontend/src/hooks/](frontend/src/hooks/)**

```javascript
// frontend/src/hooks/useWalletBalance.js
import { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";

export function useWalletBalance(walletProvider, address) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletProvider || !address) {
      setLoading(false);
      return;
    }

    async function fetchBalance() {
      try {
        const provider = new BrowserProvider(walletProvider);
        const balanceWei = await provider.getBalance(address);
        const balanceCelo = formatEther(balanceWei);
        setBalance(Number(balanceCelo).toFixed(4));
      } catch (err) {
        console.error("Failed to fetch balance:", err);
        setBalance("0.0000");
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);  // Refresh every 5s
    return () => clearInterval(interval);
  }, [walletProvider, address]);

  return { balance, loading };
}
```

**Step 2: Update [AmountInput.jsx](frontend/src/components/BetPage/AmountInput.jsx)**

```javascript
import { useWalletBalance } from "../../hooks/useWalletBalance";

export function AmountInput({ 
  amount, 
  setAmount, 
  phase, 
  walletProvider,    // ← NEW
  walletAddress      // ← NEW
}) {
  const { balance, loading } = useWalletBalance(walletProvider, walletAddress);
  
  return (
    <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.mutedLight }}>
      Balance: {loading ? "..." : balance || "0.0000"} CELO
    </span>
  );
}
```

**Step 3: Pass walletProvider and address from BetPage**

In [BetPage/index.jsx](frontend/src/components/BetPage/index.jsx), update the AmountInput call:

```javascript
<AmountInput 
  amount={amount} 
  setAmount={setAmount} 
  phase={phase}
  walletProvider={walletProvider}      // ← ADD
  walletAddress={address}              // ← ADD (or get from App.jsx)
/>
```

---

## 3. Stats Fetching: Total, Wins, Net P&L

### Data Flow Architecture

```
Frontend (BetPage) → Backend API (/api/user/stats) → 
MongoDB aggregation → Calculated stats → 
Frontend displays in StatsRow
```

### Frontend Fetching

**Location:** [frontend/src/App.jsx](frontend/src/App.jsx#L120-L150)

```javascript
const [stats, setStats] = useState({ wins: 0, losses: 0, net: 0 });

async function loadUserData(token) {
  if (!token) return;

  const headers = { Authorization: `Bearer ${token}` };

  const statsRes = await fetch(apiUrl("/api/user/stats"), { headers });
  
  if (statsRes.ok) {
    const statsPayload = await statsRes.json();
    if (statsPayload.success) {
      setStats({
        wins: Number(statsPayload.data.wins || 0),
        losses: Number(statsPayload.data.losses || 0),
        net: Number.parseFloat(statsPayload.data.net || 0),
      });
    }
  }
}

// Trigger on wallet connect
useEffect(() => {
  if (walletConnected) {
    authenticateWallet();
  }
}, [walletConnected]);
```

### Backend Calculation

**Backend Route:** [backend/src/routes/index.js](backend/src/routes/index.js#L17)

```javascript
router.get("/user/stats", authMiddleware, userController.getStats);
```

**Backend Controller:** [backend/src/controllers/userController.js](backend/src/controllers/userController.js#L1-L30)

```javascript
async getStats(req, res) {
  try {
    const { userId } = req.user;  // ← Extracted from JWT by authMiddleware
    const stats = await User.getStats(userId);
    
    res.json({
      success: true,
      data: {
        total_bets: stats.total_bets,
        wins: stats.wins,
        losses: stats.losses,
        net: stats.net.toFixed(4),   // Net P&L
        win_rate: stats.win_rate,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
```

### MongoDB Aggregation Pipeline

**Location:** [backend/src/models/User.js](backend/src/models/User.js#L57-L99)

```javascript
static async getStats(userId) {
  const agg = await Bet.Model.aggregate([
    // Step 1: Match only bets by this user
    { $match: { user_id: targetId } },
    
    // Step 2: Group and calculate all metrics
    {
      $group: {
        _id: null,
        total_bets: { $sum: 1 },                    // Count all bets
        wins: {
          $sum: {
            $cond: [{ $eq: ["$result", "win"] }, 1, 0]  // Count wins
          }
        },
        losses: {
          $sum: {
            $cond: [{ $eq: ["$result", "lose"] }, 1, 0]  // Count losses
          }
        },
        net: {
          $sum: {
            $cond: [
              { $eq: ["$result", "win"] },
              { $subtract: ["$payout", "$amount"] },  // Win: payout - bet = profit
              { $multiply: ["$amount", -1] }          // Loss: -bet = loss
            ]
          }
        },
      }
    }
  ]);
  
  return agg[0];  // Returns { total_bets, wins, losses, net }
}
```

### Calculation Example

**User's bet history:**
```
Bet 1: Amount 0.02 CELO, Payout 0.0376 CELO, Result: WIN   → Net: +0.0176
Bet 2: Amount 0.05 CELO, Payout 0.094 CELO,  Result: WIN   → Net: +0.044
Bet 3: Amount 0.03 CELO, Payout 0,          Result: LOSE  → Net: -0.03
```

**Aggregation result:**
```
total_bets = 3
wins = 2
losses = 1
net = 0.0176 + 0.044 + (-0.03) = 0.0316 CELO
```

### Frontend Display

**Location:** [frontend/src/components/StatsRow.jsx](frontend/src/components/StatsRow.jsx#L1-L50)

```javascript
export function StatsRow({ stats, total }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[
        { label: "Total", value: total, color: COLORS.text },
        {
          label: "Wins",
          value: stats.wins,
          color: COLORS.green,
          sub: `${calculateWinRate(stats.wins, total)}% rate`,
        },
        {
          label: "Net P&L",
          value: `${stats.net >= 0 ? "+" : ""}${stats.net}`,
          color: stats.net >= 0 ? COLORS.green : COLORS.red,
          sub: "CELO",
        },
      ].map(/* render cards */)}
    </div>
  );
}
```

---

## 4. User Withdrawals: How Winners Get Paid

### Current Withdrawal Mechanism

HashBet has **two different withdrawal systems**:

### A. Player Winnings (Automatic On-Chain Payout)

When a user **wins a bet**, they are automatically paid via the smart contract:

**Location:** [contracts/contracts/HashBet.sol](contracts/contracts/HashBet.sol#L118-L132)

```solidity
if (won) {
    payout = (bet.amount * WIN_MULTIPLIER) / 100;         // 1.88x
    uint256 houseCut = (payout * HOUSE_EDGE_BPS) / 10000;  // 6% fee
    uint256 playerPayout = payout - houseCut;
    
    totalPool -= playerPayout;
    totalBetsWon++;
    
    // ← Player automatically receives their winnings
    (bool success, ) = payable(bet.player).call{value: playerPayout}("");
    require(success, "Payout failed");
    
    emit BetSettled(_betId, bet.player, true, playerPayout);
}
```

**How it works:**
1. User wins → Settlement happens automatically
2. Payout calculated: `(bet amount × 1.88) - (6% house edge)`
3. Direct transfer to user's wallet via `payable(bet.player).call{value: ...}`
4. **No backend tracking needed** — it's all on-chain

**Example:**
```
User bets 0.5 CELO → Wins
Payout = (0.5 × 1.88) = 0.94 CELO
House cut (6%) = 0.94 × 0.06 = 0.0564 CELO
Player receives = 0.94 - 0.0564 = 0.8836 CELO
```

### B. Pool Owner Withdrawal (Admin Only)

The contract owner can withdraw from the pool:

**Location:** [contracts/contracts/HashBet.sol](contracts/contracts/HashBet.sol#L145-L151)

```solidity
function withdrawFromPool(uint256 amount) external onlyOwner {
    require(amount <= totalPool, "Insufficient pool");
    totalPool -= amount;
    (bool success, ) = payable(owner).call{value: amount}("");
    require(success, "Withdrawal failed");
    emit PoolWithdrawn(owner, amount);
}
```

**Who can call it:** Only the contract owner (set in constructor)

**Use case:** Owner withdraws excess pool funds or house profits (accumulated 6% fees)

### How to Execute Owner Withdrawal

**Via Hardhat Console:**

```bash
cd contracts
npx hardhat console --network celoSepolia
```

In the Hardhat console:
```javascript
const ethers = require("ethers");
const contractAddress = "0x17C68d648b223b9FfE3a3E6c48d093146861C389";
const amount = ethers.parseEther("1.0");  // Withdraw 1 CELO

const contract = await ethers.getContractAt("HashBet", contractAddress);
const tx = await contract.withdrawFromPool(amount);
const receipt = await tx.wait();

console.log("Withdrawal complete:", receipt.transactionHash);
```

### Data Recording (Backend)

When a bet is settled, both winner and loser info is saved to MongoDB:

**Flow:**
1. Settlement happens on-chain
2. Frontend detects win/loss result
3. Frontend saves to backend: `POST /api/bets`

**Location:** [frontend/src/components/BetPage/index.jsx](frontend/src/components/BetPage/index.jsx#L165-L190)

```javascript
const saveRes = await fetch(apiUrl("/api/bets"), {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  },
  body: JSON.stringify({
    hash: rec.hash,
    choice: rec.choice,
    amount: rec.amount,
    payout: rec.payout,         // 0 for losers, calculated for winners
    result: rec.result,         // "win" or "lose"
    blockNumber: rec.blockNumber,
  }),
});
```

**Backend stores in MongoDB:**

```javascript
{
  _id: ObjectId(...),
  user_id: ObjectId(...),
  hash: "A1F2B3C4D5...",
  choice: "Big",
  amount: 0.05,
  payout: 0.094,
  result: "win",
  block_number: 28447215,
  created_at: ISODate("2026-04-13T..."),
}
```

### Important Notes

1. **Winners don't withdraw manually** — they're paid automatically on-chain
2. **No user-initiated withdrawal button yet** — this could be added as a feature to let users withdraw account balance
3. **Pool funding** needs to happen before bets can be accepted:
   ```bash
   npx hardhat console --network celoSepolia
  const contract = await ethers.getContractAt("HashBet", "0x17C68d648b223b9FfE3a3E6c48d093146861C389");
   const tx = await contract.fundPool({ value: ethers.parseEther("5.0") });
   await tx.wait();
   ```

---

## Summary Table

| Data Point | Source | Fetched How | Update Frequency |
|---|---|---|---|
| **Block Hash** | Smart contract via `blockhash()` | On-chain during settlement | Once per bet (after mining) |
| **Block Number** | User polls `provider.getBlockNumber()` | RPC call | Every 1.8 seconds |
| **Wallet Balance** | Currently hardcoded ❌ | Should use `provider.getBalance(address)` | Should be every 5 seconds |
| **User Wins** | MongoDB aggregation (count wins) | Backend API `/api/user/stats` | On-demand after bet settlement |
| **Net P&L** | MongoDB aggregation (sum payout - amount) | Backend API `/api/user/stats` | On-demand after bet settlement |
| **Player Payout** | Smart contract logic | Direct transfer via `payable().call()` | Automatic during settlement |
| **Pool Balance** | Smart contract state | View call `totalPool()` | Always up-to-date on-chain |

---

## Next Steps to Improve

1. **Fix wallet balance display** → Implement the hook from Section 2
2. **Add user withdrawal UI** → Button to withdraw profits to external wallet
3. **Improve stats refresh** → Auto-update after each bet settlement
4. **Add balance alerts** → Warn if user balance < min bet
5. **Contract state UI** → Display pool balance, total bets, total payouts
