# Smart Contracts for HashBet

### Solidity + Hardhat + Celo

## Setup

```bash
cd contracts
npm install
cp .env.example .env

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

## Contract Overview

### HashBet.sol
- Main betting contract on Celo Mainnet
- Players can place bets on Big (8-F) or Small (0-7)
- Win multiplier: 1.88x
- House edge: 6%
- Provably fair: uses on-chain block hash

## Key Functions

### `placeBet(bool _isBig)`
- Player places a bet
- Bet ID created and tracked
- Emits `BetPlaced` event

### `settleBet(uint256 _betId)`
- Settle bet once block is mined
- Extract first hex char from block hash
- Determine winner and payout

### `fundPool()`
- Anyone can fund the betting pool
- Pool must have sufficient funds

### `withdrawFromPool(uint256 amount)`
- Owner only
- Withdraw house earnings

## Network Configuration

| Network | Chain ID | RPC |
|---------|----------|-----|
| Celo Testnet (Alfajores) | 44787 | https://celo-alfajores.drpc.org |
| Celo Mainnet | 42220 | https://forno.celo.org |

## Environment Variables

```env
PRIVATE_KEY=your-private-key
CELOSCAN_API_KEY=your-celoscan-key
CELO_TESTNET_RPC_URL=https://celo-alfajores.drpc.org
CELO_MAINNET_RPC_URL=https://forno.celo.org
INITIAL_POOL_FUND_CELO=0
```

`PRIVATE_KEY` is only required for deploy/verify tasks. Local compile/test works without it.

`INITIAL_POOL_FUND_CELO` controls optional funding immediately after deploy. Set to `0` to skip funding.

## Deployment Addresses

- **Testnet (Alfajores)**: `0x...` (to be updated after deployment)
- **Mainnet**: `0x...` (to be updated after deployment)

## Testing

```bash
# Run all tests
npm run test

# Run specific test
npx hardhat test test/HashBet.test.js

# With gas reporter
REPORT_GAS=true npm run test
```

## Verification

```bash
npx hardhat verify --network celoMainnet DEPLOYED_ADDRESS
```
