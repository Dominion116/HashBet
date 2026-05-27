require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const tokenAddress = process.env.PAYMENT_TOKEN_ADDRESS;

  if (!contractAddress || !tokenAddress) {
    console.error("Set CONTRACT_ADDRESS and PAYMENT_TOKEN_ADDRESS in .env");
    process.exit(1);
  }

  const [signer] = await ethers.getSigners();
  const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];
  const token = await ethers.getContractAt(erc20Abi, tokenAddress);
  const decimals = await token.decimals();
  const symbol = await token.symbol();
  const div = 10n ** BigInt(decimals);

  const poolBalance = await token.balanceOf(contractAddress);
  const ownerBalance = await token.balanceOf(signer.address);

  console.log(`Token:          ${symbol} (${tokenAddress})`);
  console.log(`Pool balance:   ${poolBalance} raw → ${Number(poolBalance) / Number(div)} ${symbol}`);
  console.log(`Owner balance:  ${ownerBalance} raw → ${Number(ownerBalance) / Number(div)} ${symbol}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
