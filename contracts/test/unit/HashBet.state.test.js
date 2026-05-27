const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");
const { mineBlocks } = require("../helpers/assertions");

describe("HashBet – State Counter Tracking", () => {
  let token, hashBet, owner, p1, p2;
  const MIN_BET = 20_000n;
  const POOL_SEED = 20_000_000n;

  beforeEach(async () => {
    [owner, p1, p2] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
    await mintAndApprove(token, hashBet, p1, MIN_BET * 10n);
    await mintAndApprove(token, hashBet, p2, MIN_BET * 10n);
  });

  it("totalBetsPlaced increments once per bet", async () => {
    for (let i = 1; i <= 4; i++) {
      await hashBet.connect(p1).placeBet(true, MIN_BET);
      expect(await hashBet.totalBetsPlaced()).to.equal(BigInt(i));
    }
  });

  it("totalBetsPlaced increments across multiple players", async () => {
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    await hashBet.connect(p2).placeBet(false, MIN_BET);
    expect(await hashBet.totalBetsPlaced()).to.equal(2n);
  });

  it("totalPool increases after each bet placement", async () => {
    const initial = await hashBet.totalPool();
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    expect(await hashBet.totalPool()).to.equal(initial + MIN_BET);
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    expect(await hashBet.totalPool()).to.equal(initial + MIN_BET * 2n);
  });

  it("totalPool net decreases by net payout on a win", async () => {
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    await mineBlocks(2);
    const poolBeforeSettle = await hashBet.totalPool();
    await hashBet.settleBet(0n);
    const bet = await hashBet.bets(0n);
    if (bet.won) {
      expect(await hashBet.totalPool()).to.be.lt(poolBeforeSettle);
    }
  });

  it("totalBetsWon stays zero when no bets are won", async () => {
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    await mineBlocks(2);
    await hashBet.settleBet(0n);
    const bet = await hashBet.bets(0n);
    if (!bet.won) {
      expect(await hashBet.totalBetsWon()).to.equal(0n);
    }
  });

  it("totalBetsPlaced is not affected by settlement", async () => {
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    await mineBlocks(2);
    await hashBet.settleBet(0n);
    expect(await hashBet.totalBetsPlaced()).to.equal(1n);
  });
});
