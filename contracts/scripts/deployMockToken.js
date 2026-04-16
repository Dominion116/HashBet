const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying MockERC20 from:", deployer.address);

  const Token = await hre.ethers.getContractFactory("MockERC20");
  const token = await Token.deploy("cUSD", "cUSD");
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("✓ MockERC20 deployed to:", tokenAddress);

  // Mint some test balance to deployer wallet for pool funding / testing.
  const mintAmount = hre.ethers.parseEther("10000");
  const mintTx = await token.mint(deployer.address, mintAmount);
  await mintTx.wait();
  console.log("✓ Minted 10000 cUSD to deployer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
