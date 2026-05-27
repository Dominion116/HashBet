require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    console.error("Set CONTRACT_ADDRESS in .env");
    process.exit(1);
  }

  const contract = await ethers.getContractAt("HashBet", address);

  const [owner, token, symbol, decimals, minBet, maxBet, pool, placed, won] =
    await Promise.all([
      contract.owner(),
      contract.paymentToken(),
      contract.paymentTokenSymbol(),
      contract.paymentTokenDecimals(),
      contract.minBetAmount(),
      contract.maxBetAmount(),
      contract.totalPool(),
      contract.totalBetsPlaced(),
      contract.totalBetsWon(),
    ]);

  const div = 10n ** BigInt(decimals);
  const toToken = (raw) => (Number(raw) / Number(div)).toFixed(Number(decimals));

  console.log("=== HashBet Contract State ===");
  console.log(`Address:        ${address}`);
  console.log(`Owner:          ${owner}`);
  console.log(`Token:          ${symbol} @ ${token}`);
  console.log(`Min Bet:        ${toToken(minBet)} ${symbol}`);
  console.log(`Max Bet:        ${toToken(maxBet)} ${symbol}`);
  console.log(`Pool:           ${toToken(pool)} ${symbol}`);
  console.log(`Bets Placed:    ${placed}`);
  console.log(`Bets Won:       ${won}`);
  if (placed > 0n) {
    console.log(`Win Rate:       ${((Number(won) / Number(placed)) * 100).toFixed(1)}%`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
