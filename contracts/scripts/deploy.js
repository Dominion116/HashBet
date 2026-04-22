const hre = require("hardhat");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying HashBet contract...");

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  
  const HashBet = await hre.ethers.getContractFactory("HashBet", deployer);
  const paymentTokenAddress = process.env.PAYMENT_TOKEN_ADDRESS || "";
  const paymentTokenSymbol = process.env.PAYMENT_TOKEN_SYMBOL || "cUSD";
  const tokenAbi = [
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 value) returns (bool)",
  ];

  if (!paymentTokenAddress) {
    throw new Error("PAYMENT_TOKEN_ADDRESS is required to deploy the ERC20-based contract");
  }

  if (!ethers.isAddress(paymentTokenAddress)) {
    throw new Error("PAYMENT_TOKEN_ADDRESS must be a valid EVM address (example: 0x1234...)");
  }

  const hashBet = await HashBet.deploy(paymentTokenAddress, paymentTokenSymbol);
  await hashBet.waitForDeployment();

  const deployedAddress = await hashBet.getAddress();
  console.log("✓ HashBet deployed to:", deployedAddress);

  // Write deployments.json for SDK
  const deploymentsPath = path.resolve(__dirname, "../deployments.json");
  let deployments = {};
  if (fs.existsSync(deploymentsPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
  }
  // Use network name from hre.network.name
  const network = hre.network.name || "unknown";
  deployments[network] = { address: deployedAddress };
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log(`Deployment address saved to deployments.json for network: ${network}`);

  const initialFund = process.env.INITIAL_POOL_FUND_TOKEN_AMOUNT || "0";
  const token = new hre.ethers.Contract(paymentTokenAddress, tokenAbi, deployer);
  const tokenDecimals = Number(await token.decimals());
  const initialFundValue = hre.ethers.parseUnits(initialFund, tokenDecimals);

  if (initialFundValue > 0n) {
    const approveTx = await token.approve(await hashBet.getAddress(), initialFundValue);
    await approveTx.wait();

    const fundTx = await hashBet.fundPool(initialFundValue);
    await fundTx.wait();
    console.log(`✓ Pool funded with ${initialFund} ${paymentTokenSymbol}`);
  } else {
    console.log("ℹ Skipping initial pool funding (INITIAL_POOL_FUND_TOKEN_AMOUNT=0)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
