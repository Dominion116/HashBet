const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");
const { mineBlocks } = require("../helpers/assertions");

describe("HashBet – View Functions", () => {
  let token, hashBet, owner, p1, p2;
  const MIN_BET = 20_000n;
  const POOL_SEED = 10_000_000n;

  beforeEach(async () => {
    [owner, p1, p2] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
    await mintAndApprove(token, hashBet, p1, MIN_BET * 10n);
    await mintAndApprove(token, hashBet, p2, MIN_BET * 10n);
  });

  describe("getPlayerBets", () => {
    it("returns empty array for player with no bets", async () => {
      const bets = await hashBet.getPlayerBets(p1.address);
      expect(bets.length).to.equal(0);
    });

    it("returns one betId after placing one bet", async () => {
      await hashBet.connect(p1).placeBet(true, MIN_BET);
      const bets = await hashBet.getPlayerBets(p1.address);
      expect(bets.length).to.equal(1);
      expect(bets[0]).to.equal(0n);
    });

    it("returns all betIds for multiple bets from same player", async () => {
      await hashBet.connect(p1).placeBet(true, MIN_BET);
      await hashBet.connect(p1).placeBet(false, MIN_BET);
      await hashBet.connect(p1).placeBet(true, MIN_BET);
      const bets = await hashBet.getPlayerBets(p1.address);
      expect(bets.length).to.equal(3);
    });

    it("does not cross-contaminate bet lists between players", async () => {
      await hashBet.connect(p1).placeBet(true, MIN_BET);
      await hashBet.connect(p2).placeBet(false, MIN_BET);
      const p1Bets = await hashBet.getPlayerBets(p1.address);
      const p2Bets = await hashBet.getPlayerBets(p2.address);
      expect(p1Bets.length).to.equal(1);
      expect(p2Bets.length).to.equal(1);
      expect(p1Bets[0]).to.equal(0n);
      expect(p2Bets[0]).to.equal(1n);
    });
  });

  describe("getBetDetails", () => {
    beforeEach(async () => {
      await hashBet.connect(p1).placeBet(true, MIN_BET);
    });

    it("returns correct player address", async () => {
      const [player] = await hashBet.getBetDetails(0n);
      expect(player).to.equal(p1.address);
    });

    it("returns correct bet amount", async () => {
      const [, amount] = await hashBet.getBetDetails(0n);
      expect(amount).to.equal(MIN_BET);
    });

    it("returns correct isBig value", async () => {
      const [, , isBig] = await hashBet.getBetDetails(0n);
      expect(isBig).to.be.true;
    });

    it("returns settled = false before settlement", async () => {
      const [, , , settled] = await hashBet.getBetDetails(0n);
      expect(settled).to.be.false;
    });

    it("returns settled = true after settlement", async () => {
      await mineBlocks(2);
      await hashBet.settleBet(0n);
      const [, , , settled] = await hashBet.getBetDetails(0n);
      expect(settled).to.be.true;
    });
  });
});
