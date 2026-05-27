require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    console.error("Set CONTRACT_ADDRESS in .env");
    process.exit(1);
  }

  const [signer] = await ethers.getSigners();
  const contract = await ethers.getContractAt("HashBet", address, signer);
  const minBet = await contract.minBetAmount();

  console.log("=== Gas Estimates ===");
  console.log(`Contract: ${address}`);
  console.log(`Network:  ${hre.network.name}`);

  try {
    const gas = await contract.placeBet.estimateGas(true, minBet);
    console.log(`placeBet(true, ${minBet}):  ${gas} gas`);
  } catch (e) {
    console.log(`placeBet estimate failed: ${e.shortMessage || e.message}`);
  }

  try {
    const gas = await contract.settleBet.estimateGas(0n);
    console.log(`settleBet(0):              ${gas} gas`);
  } catch (e) {
    console.log(`settleBet estimate unavailable (no open bets): ${e.shortMessage || e.message}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
