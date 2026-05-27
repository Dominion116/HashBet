const { task } = require("hardhat/config");

task("deploy-verify", "Deploy HashBet and verify on Blockscout in one step")
  .addParam("token", "ERC20 payment token address")
  .addParam("symbol", "Token symbol (e.g. USDC)")
  .setAction(async ({ token, symbol }, hre) => {
    console.log(`Deploying HashBet on ${hre.network.name}...`);

    const HashBet = await hre.ethers.getContractFactory("HashBet");
    const contract = await HashBet.deploy(token, symbol);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`Deployed to: ${address}`);

    if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
      console.log("Skipping verification on local network.");
      return;
    }

    console.log("Waiting 5 seconds before verification...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      await hre.run("verify:verify", {
        address,
        constructorArguments: [token, symbol],
      });
      console.log("Verification successful.");
    } catch (err) {
      if (err.message.includes("Already Verified")) {
        console.log("Contract already verified.");
      } else {
        console.error("Verification failed:", err.message);
      }
    }
  });
