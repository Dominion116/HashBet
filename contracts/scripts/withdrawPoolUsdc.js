require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const rpc = process.env.CELO_MAINNET_RPC_URL || process.env.CELO_RPC_URL || "https://forno.celo.org";
  const chainId = Number(process.env.CELO_CHAIN_ID || 42220);
  const provider = new ethers.JsonRpcProvider(rpc, chainId);

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set in contracts/.env");
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddr = process.env.CONTRACT_ADDRESS;

  if (!contractAddr) {
    throw new Error("CONTRACT_ADDRESS is not set in contracts/.env");
  }

  const abi = [
    "function owner() view returns (address)",
    "function paymentTokenDecimals() view returns (uint8)",
    "function paymentTokenSymbol() view returns (string)",
    "function totalPool() view returns (uint256)",
    "function withdrawFromPool(uint256 amount)",
  ];

  const c = new ethers.Contract(contractAddr, abi, wallet);

  const [owner, decimals, symbol, poolBefore] = await Promise.all([
    c.owner(),
    c.paymentTokenDecimals(),
    c.paymentTokenSymbol(),
    c.totalPool(),
  ]);

  if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
    throw new Error(`Signer ${wallet.address} is not owner ${owner}`);
  }


  // Withdraw 4 cUSD (hardcoded)
  const withdrawAmount = ethers.parseUnits("4", Number(decimals));
  if (poolBefore < withdrawAmount) {
    throw new Error(`Insufficient pool. Have ${ethers.formatUnits(poolBefore, decimals)} ${symbol}, need 4 ${symbol}`);
  }
  const tx = await c.withdrawFromPool(withdrawAmount);
  await tx.wait();

  const poolAfter = await c.totalPool();

  console.log("WALLET=" + wallet.address);
  console.log("CONTRACT=" + contractAddr);
  console.log("SYMBOL=" + symbol);
  console.log("WITHDRAW_TX=" + tx.hash);
  console.log("POOL_BEFORE=" + ethers.formatUnits(poolBefore, decimals));
  console.log("POOL_AFTER=" + ethers.formatUnits(poolAfter, decimals));
}

main().catch((err) => {
  console.error("WITHDRAW_ERROR", err.message || err);
  process.exit(1);
});
