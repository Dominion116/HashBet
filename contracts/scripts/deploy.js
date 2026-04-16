const hre = require("hardhat");

async function main() {
  console.log("Deploying HashBet contract...");

  const HashBet = await hre.ethers.getContractFactory("HashBet");
  const paymentTokenAddress = process.env.PAYMENT_TOKEN_ADDRESS;
  const paymentTokenSymbol = process.env.PAYMENT_TOKEN_SYMBOL || "cUSD";

  if (!paymentTokenAddress) {
    throw new Error("PAYMENT_TOKEN_ADDRESS is required to deploy the ERC20-based contract");
  }

  const hashBet = await HashBet.deploy(paymentTokenAddress, paymentTokenSymbol);
  await hashBet.waitForDeployment();

  console.log("✓ HashBet deployed to:", await hashBet.getAddress());

  const initialFund = process.env.INITIAL_POOL_FUND_TOKEN_AMOUNT || "0";
  const initialFundValue = hre.ethers.parseEther(initialFund);

  if (initialFundValue > 0n) {
    const fundTx = await hashBet.fundPool(initialFundValue);
    await fundTx.wait();
    console.log(`✓ Pool funded with ${initialFund} ${paymentTokenSymbol}`);
  } else {
    console.log("ℹ Skipping initial pool funding (INITIAL_POOL_FUND_CELO=0)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
