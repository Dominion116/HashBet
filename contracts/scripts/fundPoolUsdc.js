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
  const tokenAddr = process.env.PAYMENT_TOKEN_ADDRESS;

  if (!contractAddr) {
    throw new Error("CONTRACT_ADDRESS is not set in contracts/.env");
  }

  if (!tokenAddr) {
    throw new Error("PAYMENT_TOKEN_ADDRESS is not set in contracts/.env");
  }

  const contractAbi = [
    "function totalPool() view returns (uint256)",
    "function fundPool(uint256 amount)",
    "function paymentToken() view returns (address)",
    "function paymentTokenDecimals() view returns (uint8)"
  ];

  const tokenAbi = [
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function allowance(address owner,address spender) view returns (uint256)",
    "function approve(address spender,uint256 amount) returns (bool)"
  ];

  const hashBet = new ethers.Contract(contractAddr, contractAbi, wallet);
  const token = new ethers.Contract(tokenAddr, tokenAbi, wallet);

  const [configuredToken, configuredDecimals, symbol, decimals] = await Promise.all([
    hashBet.paymentToken(),
    hashBet.paymentTokenDecimals(),
    token.symbol(),
    token.decimals()
  ]);

  if (configuredToken.toLowerCase() !== tokenAddr.toLowerCase()) {
    throw new Error(`Contract payment token mismatch: expected ${tokenAddr}, got ${configuredToken}`);
  }

  if (Number(configuredDecimals) !== Number(decimals)) {
    throw new Error(`Decimal mismatch: contract=${configuredDecimals} token=${decimals}`);
  }

  const amount = ethers.parseUnits("1", decimals);
  const [walletBal, poolBefore] = await Promise.all([
    token.balanceOf(wallet.address),
    hashBet.totalPool()
  ]);

  if (walletBal < amount) {
    throw new Error(`Insufficient ${symbol}. Have ${ethers.formatUnits(walletBal, decimals)}, need 1`);
  }

  const allowance = await token.allowance(wallet.address, contractAddr);
  if (allowance < amount) {
    const approveTx = await token.approve(contractAddr, amount);
    await approveTx.wait();
    console.log("APPROVE_TX=" + approveTx.hash);
  }

  const fundTx = await hashBet.fundPool(amount);
  await fundTx.wait();

  const poolAfter = await hashBet.totalPool();

  console.log("WALLET=" + wallet.address);
  console.log("CONTRACT=" + contractAddr);
  console.log("TOKEN=" + tokenAddr);
  console.log("SYMBOL=" + symbol);
  console.log("FUND_TX=" + fundTx.hash);
  console.log("POOL_BEFORE=" + ethers.formatUnits(poolBefore, decimals));
  console.log("POOL_AFTER=" + ethers.formatUnits(poolAfter, decimals));
}

main().catch((err) => {
  console.error("FUND_ERROR", err.message || err);
  process.exit(1);
});
