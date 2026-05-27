const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("./setup");

async function fixtureWithFundedPool(poolAmount = 10_000_000n) {
  const [owner, player, player2, player3] = await ethers.getSigners();
  const { token, hashBet } = await deployFull();
  await fundPool(token, hashBet, owner, poolAmount);
  return { token, hashBet, owner, player, player2, player3, poolAmount };
}

async function fixtureWithActiveBet(isBig = true, betAmount = 20_000n) {
  const ctx = await fixtureWithFundedPool();
  await mintAndApprove(ctx.token, ctx.hashBet, ctx.player, betAmount);
  await ctx.hashBet.connect(ctx.player).placeBet(isBig, betAmount);
  return { ...ctx, betAmount, isBig };
}

async function fixtureWithSettledBet(isBig = true, betAmount = 20_000n) {
  const ctx = await fixtureWithActiveBet(isBig, betAmount);
  await ethers.provider.send("evm_mine", []);
  await ethers.provider.send("evm_mine", []);
  await ctx.hashBet.settleBet(0n);
  return ctx;
}

module.exports = {
  fixtureWithFundedPool,
  fixtureWithActiveBet,
  fixtureWithSettledBet,
};
