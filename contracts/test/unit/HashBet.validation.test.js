const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");

describe("HashBet – Bet Placement (validation)", () => {
  let token, hashBet, owner, player;
  const MIN_BET = 20_000n;
  const MAX_BET = 100_000n;
  const POOL_SEED = 5_000_000n;

  beforeEach(async () => {
    [owner, player] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
    await mintAndApprove(token, hashBet, player, MAX_BET * 10n);
  });

  it("reverts when bet is below minimum", async () => {
    await expect(
      hashBet.connect(player).placeBet(true, MIN_BET - 1n)
    ).to.be.revertedWith("Bet too small");
  });

  it("reverts when bet is above maximum", async () => {
    await expect(
      hashBet.connect(player).placeBet(true, MAX_BET + 1n)
    ).to.be.revertedWith("Bet too large");
  });

  it("reverts when pool cannot cover potential payout", async () => {
    const { hashBet: emptyHB } = await deployFull();
    await mintAndApprove(token, emptyHB, player, MIN_BET);
    await expect(
      emptyHB.connect(player).placeBet(true, MIN_BET)
    ).to.be.revertedWith("Insufficient pool");
  });

  it("reverts when player has insufficient token balance", async () => {
    const broke = (await ethers.getSigners())[2];
    await token.connect(broke).approve(await hashBet.getAddress(), MIN_BET);
    await expect(
      hashBet.connect(broke).placeBet(true, MIN_BET)
    ).to.be.revertedWith("Insufficient balance");
  });

  it("reverts when allowance is not set", async () => {
    const noApproval = (await ethers.getSigners())[3];
    await token.mint(noApproval.address, MIN_BET);
    await expect(
      hashBet.connect(noApproval).placeBet(true, MIN_BET)
    ).to.be.revertedWith("Insufficient allowance");
  });

  it("accepts exact minimum bet amount", async () => {
    await expect(hashBet.connect(player).placeBet(true, MIN_BET)).to.not.be.reverted;
  });

  it("accepts exact maximum bet amount", async () => {
    await expect(hashBet.connect(player).placeBet(true, MAX_BET)).to.not.be.reverted;
  });

  it("marks bet as unsettled after placement", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    const bet = await hashBet.bets(0n);
    expect(bet.settled).to.be.false;
  });
});
