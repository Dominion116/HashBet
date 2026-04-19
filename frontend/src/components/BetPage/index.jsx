import { useState, useEffect, useRef } from "react";
import { BrowserProvider, Contract, Interface, MaxUint256, formatUnits, parseUnits } from "ethers";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { StatsRow } from "../StatsRow";
import { PoolStatus } from "../PoolStatus";
import { WalletStatusBar } from "../WalletStatusBar";
import { ChoiceButtons } from "./ChoiceButtons";
import { AmountInput } from "./AmountInput";
import { PayoutDisplay } from "./PayoutDisplay";
import { PlaceBetButton } from "./PlaceBetButton";
import { ConfirmingPhase, MiningPhase, ResultPhase } from "./PhaseHandlers";
import { HashReveal } from "./HashReveal";
import { apiUrl } from "../../utils/api";

const CONTRACT_ABI = [
  "event BetPlaced(uint256 indexed betId, address indexed player, uint256 amount, bool isBig, uint256 blockNumber)",
  "function placeBet(bool _isBig, uint256 betAmount)",
  "function settleBet(uint256 _betId)",
  "function totalPool() view returns (uint256)",
  "function getBetDetails(uint256 betId) view returns (address player, uint256 amount, bool isBig, bool settled, bool won)",
];

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const MIN_BET = 0.02;
const MAX_BET = 0.1;
const LOCAL_BET_CACHE_KEY = "hashbet:settledBets";

function readLocalBetCache() {
  try {
    const raw = localStorage.getItem(LOCAL_BET_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalBetCache(bets) {
  try {
    localStorage.setItem(LOCAL_BET_CACHE_KEY, JSON.stringify(bets));
  } catch {
    // Ignore storage failures; the live UI still updates.
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function BetPage({
  walletConnected,
  connectWallet,
  ensureAuth,
  authToken,
  contractConfig,
  walletProvider,
  walletAddress,
  walletBalance,
  tokenSymbol = "USDC",
  poolBalance,
  poolLoading,
  poolError,
  stats,
  history,
  onBetSettled,
}) {
  const [choice, setChoice] = useState(null);
  const [amount, setAmount] = useState("0.02");
  const [phase, setPhase] = useState("idle");
  const [miningProg, setMiningProg] = useState(0);
  const [lastHash, setLastHash] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const ivRef = useRef(null);
  const timeoutRef = useRef(null);
  const tokenDecimals = Number(contractConfig?.paymentTokenDecimals ?? 6);

  const amt = parseFloat(amount) || 0;
  const isValidAmount = amt >= MIN_BET && amt <= MAX_BET;
  const payout = (amt * 1.88).toFixed(3);

  async function placeBet() {
    let currentAuthToken = authToken;

    if (!walletConnected) {
      await connectWallet();
      return;
    }

    if (!currentAuthToken) {
      try {
        currentAuthToken = await ensureAuth?.();
        if (!currentAuthToken) {
          alert("Wallet auth is still loading. Try again in a moment.");
          return;
        }
      } catch (err) {
        alert(err.message || "Failed to authenticate wallet");
        return;
      }
    }

    if (!contractConfig?.contractAddress) {
      alert("Contract address not configured in backend.");
      return;
    }
    if (!contractConfig?.paymentTokenAddress) {
      alert("Payment token not configured in backend.");
      return;
    }
    if (!choice || !isValidAmount) return;
    
    // Check wallet balance
    const currentBalance = parseFloat(walletBalance) || 0;
    if (currentBalance < amt) {
      alert(`Insufficient balance. You have ${walletBalance} ${tokenSymbol} but need ${amt} ${tokenSymbol} for this bet.`);
      return;
    }
    
    if (!walletProvider) {
      alert("Wallet provider is not ready yet. Reopen the wallet modal.");
      return;
    }

    try {
      setPhase("confirming");
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new Contract(contractConfig.contractAddress, CONTRACT_ABI, signer);
      const paymentToken = new Contract(contractConfig.paymentTokenAddress, ERC20_ABI, signer);
      const iface = new Interface(CONTRACT_ABI);
      const txOverrides = {};

      if (walletProvider?.isMiniPay) {
        const feeData = await provider.getFeeData();
        if (feeData?.gasPrice) {
          txOverrides.gasPrice = feeData.gasPrice;
          txOverrides.type = 0;
        }
      }

      const betWei = parseUnits(String(amt), tokenDecimals);
      const requiredPoolWei = (betWei * 188n) / 100n;
      const poolWei = await contract.totalPool();

      if (poolWei < requiredPoolWei) {
        const available = Number(formatUnits(poolWei, tokenDecimals)).toFixed(4);
        const required = Number(formatUnits(requiredPoolWei, tokenDecimals)).toFixed(4);
        alert(`Bet unavailable: pool too low (${available} ${tokenSymbol} available, ${required} ${tokenSymbol} required). Ask the owner to fund the pool.`);
        setPhase("idle");
        setMiningProg(0);
        return;
      }

      const spender = contractConfig.contractAddress;
      const allowance = await paymentToken.allowance(await signer.getAddress(), spender);
      if (allowance < betWei) {
        const approveTx = await paymentToken.approve(spender, MaxUint256);
        await approveTx.wait();
      }

      const tx = await contract.placeBet(choice === "Big", betWei, txOverrides);

      setPhase("mining");
      setMiningProg(20);

      const receipt = await tx.wait();
      setMiningProg(40);

      let betId = null;
      let targetBlock = null;

      for (const log of receipt.logs || []) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "BetPlaced") {
            betId = Number(parsed.args.betId);
            targetBlock = Number(parsed.args.blockNumber);
            break;
          }
        } catch (err) {
          // Ignore non-contract logs
        }
      }

      if (betId == null || targetBlock == null) {
        throw new Error("Could not parse BetPlaced event from transaction receipt");
      }

      let progress = 40;
      while ((await provider.getBlockNumber()) <= targetBlock) {
        progress = Math.min(progress + 8, 80);
        setMiningProg(progress);
        await sleep(1800);
      }

      const settleTx = await contract.settleBet(betId, txOverrides);
      await settleTx.wait();
      setMiningProg(98);

      const details = await contract.getBetDetails(betId);
      const won = Boolean(details.won);
      const result = won ? "win" : "lose";

      const blockData = await provider.getBlock(targetBlock);
      const blockHash = (blockData?.hash || tx.hash).replace(/^0x/i, "").toUpperCase();

      const rec = {
        hash: blockHash,
        choice,
        amount: amt,
        payout: amt * 1.88,
        result,
        blockNumber: targetBlock,
      };

      onBetSettled(rec);
      setLastHash(rec.hash);
      setLastResult(result);
      setMiningProg(100);
      setPhase("result");

      const cachedBets = readLocalBetCache();
      const mergedCache = [rec, ...cachedBets.filter((entry) => entry.hash !== rec.hash)];
      writeLocalBetCache(mergedCache.slice(0, 50));

      try {
        const tokenForSave = currentAuthToken || localStorage.getItem("authToken") || "";
        const saveRes = await fetch(apiUrl("/api/bets"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenForSave}`,
          },
          body: JSON.stringify({
            hash: rec.hash,
            choice: rec.choice,
            amount: rec.amount,
            payout: rec.payout,
            result: rec.result,
            blockNumber: rec.blockNumber,
          }),
        });

        if (!saveRes.ok) {
          const payload = await saveRes.json().catch(() => ({}));
          if (saveRes.status === 401) {
            const refreshedToken = await ensureAuth?.();
            const retryToken = refreshedToken || localStorage.getItem("authToken") || "";

            const retryRes = await fetch(apiUrl("/api/bets"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${retryToken}`,
              },
              body: JSON.stringify({
                hash: rec.hash,
                choice: rec.choice,
                amount: rec.amount,
                payout: rec.payout,
                result: rec.result,
                blockNumber: rec.blockNumber,
              }),
            });

            if (!retryRes.ok) {
              const retryPayload = await retryRes.json().catch(() => ({}));
              throw new Error(retryPayload.error || "Failed to save bet to backend");
            }
          } else {
            throw new Error(payload.error || "Failed to save bet to backend");
          }
        }
      } catch (saveErr) {
        console.warn("Bet saved locally but backend sync failed:", saveErr);
      }
    } catch (err) {
      console.error(err);
      const message = err?.shortMessage || err?.reason || err?.message || "Bet transaction failed";
      if (/insufficient pool/i.test(message)) {
        alert("Bet rejected: contract pool is too low. Ask the owner wallet to fund the pool first.");
      } else {
        alert(message.length > 180 ? "Bet transaction failed. Check browser console for details." : message);
      }
      setPhase("idle");
      setMiningProg(0);
    }
  }

  function reset() {
    setPhase("idle");
    setLastHash(null);
    setLastResult(null);
    setChoice(null);
  }

  useEffect(() => {
    return () => {
      if (ivRef.current) clearInterval(ivRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const total = history.length;

  return (
    <div>
      <StatsRow stats={stats} total={total} tokenSymbol={tokenSymbol} />

      <div style={{ padding: "0 14px", marginTop: 8 }}>
        <WalletStatusBar 
          walletBalance={walletBalance}
          tokenSymbol={tokenSymbol}
        />
        <PoolStatus poolBalance={poolBalance} loading={poolLoading} error={poolError} tokenSymbol={tokenSymbol} />
      </div>

      <div style={{ padding: "0px 14px 0" }}>
        {/* Description */}
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 12,
            color: COLORS.mutedLight,
            lineHeight: 1.5,
            marginBottom: 14,
          }}
        >
          Predict whether the first hex char of the next block hash will be{" "}
          <span style={{ color: COLORS.amber, fontWeight: 600 }}>Big (8–F)</span> or{" "}
          <span style={{ color: "#60A9FF", fontWeight: 600 }}>Small (0–7)</span>
          {" "}with bets between 0.02 and 0.1 {tokenSymbol}.
        </div>

        <ChoiceButtons choice={choice} setChoice={setChoice} phase={phase} />
        <AmountInput 
          amount={amount} 
          setAmount={setAmount} 
          phase={phase}
          walletBalance={walletBalance}
          tokenSymbol={tokenSymbol}
        />
        <PayoutDisplay payout={payout} tokenSymbol={tokenSymbol} />

        {phase === "idle" && (
          <PlaceBetButton
            walletConnected={walletConnected}
            phase={phase}
            choice={choice}
            amt={amt}
            isValidAmount={isValidAmount}
            onConnect={connectWallet}
            onPlaceBet={placeBet}
          />
        )}

        {phase === "confirming" && <ConfirmingPhase />}
        {phase === "mining" && <MiningPhase miningProg={miningProg} />}
        {phase === "result" && (
          <ResultPhase
            lastResult={lastResult}
            payout={payout}
            amount={amt}
            onReset={reset}
            tokenSymbol={tokenSymbol}
          />
        )}

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: COLORS.muted,
            textAlign: "center",
            letterSpacing: "0.06em",
            marginTop: 10,
          }}
        >
          6% fee on winnings · 50/50 odds · Provably fair
        </div>
      </div>

      <HashReveal lastHash={lastHash} phase={phase} />
    </div>
  );
}
