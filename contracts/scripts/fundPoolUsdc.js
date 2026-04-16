require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const rpc = process.env.CELO_SEPOLIA_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org";
  const provider = new ethers.JsonRpcProvider(rpc, 11142220);

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set in contracts/.env");
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddr = process.env.CONTRACT_ADDRESS || "0xFf1ba3d75ed54d159BC58951f0D4E1440A1F7ccC";
  const tokenAddr = process.env.PAYMENT_TOKEN_ADDRESS || "0x01C5C0122039549AD1493B8220cABEdD739BC44E";

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
