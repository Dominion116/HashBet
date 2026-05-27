const { ethers } = require("hardhat");

async function deployMockERC20(decimals = 6) {
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const token = await MockERC20.deploy("Mock USDC", "USDC", decimals);
  await token.waitForDeployment();
  return token;
}

async function deployHashBet(tokenAddress, symbol = "USDC") {
  const HashBet = await ethers.getContractFactory("HashBet");
  const contract = await HashBet.deploy(tokenAddress, symbol);
  await contract.waitForDeployment();
  return contract;
}

async function deployFull(decimals = 6) {
  const token = await deployMockERC20(decimals);
  const hashBet = await deployHashBet(await token.getAddress());
  return { token, hashBet };
}

async function fundPool(token, hashBet, funder, amount) {
  await token.mint(funder.address, amount);
  await token.connect(funder).approve(await hashBet.getAddress(), amount);
  await hashBet.connect(funder).fundPool(amount);
}

async function mintAndApprove(token, hashBet, player, amount) {
  await token.mint(player.address, amount);
  await token.connect(player).approve(await hashBet.getAddress(), amount);
}

module.exports = {
  deployMockERC20,
  deployHashBet,
  deployFull,
  fundPool,
  mintAndApprove,
};
