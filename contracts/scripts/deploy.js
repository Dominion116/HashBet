const hre = require("hardhat");

async function main() {
  console.log("Deploying HashBet contract...");

  const HashBet = await hre.ethers.getContractFactory("HashBet");
  const hashBet = await HashBet.deploy();
  await hashBet.waitForDeployment();

  console.log("✓ HashBet deployed to:", await hashBet.getAddress());

  const initialFund = process.env.INITIAL_POOL_FUND_CELO || "0";
  const initialFundValue = hre.ethers.parseEther(initialFund);

  if (initialFundValue > 0n) {
    const fundTx = await hashBet.fundPool({
      value: initialFundValue,
    });
    await fundTx.wait();
    console.log(`✓ Pool funded with ${initialFund} CELO`);
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
