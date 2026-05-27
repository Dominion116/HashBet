const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");
const { mineBlocks } = require("../helpers/assertions");

describe("HashBet – Multi-Player Interactions", () => {
  let token, hashBet, owner;
  const MIN_BET = 20_000n;
  const POOL_SEED = 50_000_000n;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
  });

  it("three players can each place one bet independently", async () => {
    const signers = await ethers.getSigners();
    const players = signers.slice(1, 4);
    for (const p of players) {
      await mintAndApprove(token, hashBet, p, MIN_BET);
      await hashBet.connect(p).placeBet(true, MIN_BET);
    }
    expect(await hashBet.totalBetsPlaced()).to.equal(3n);
  });

  it("each player's bet list is isolated", async () => {
    const signers = await ethers.getSigners();
    const [, p1, p2] = signers;
    await mintAndApprove(token, hashBet, p1, MIN_BET * 2n);
    await mintAndApprove(token, hashBet, p2, MIN_BET);
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    await hashBet.connect(p2).placeBet(false, MIN_BET);
    await hashBet.connect(p1).placeBet(false, MIN_BET);
    const p1Bets = await hashBet.getPlayerBets(p1.address);
    const p2Bets = await hashBet.getPlayerBets(p2.address);
    expect(p1Bets.length).to.equal(2);
    expect(p2Bets.length).to.equal(1);
  });

  it("global totalPool reflects all players' bets", async () => {
    const signers = await ethers.getSigners();
    const [, p1, p2, p3] = signers;
    const poolBefore = await hashBet.totalPool();
    for (const p of [p1, p2, p3]) {
      await mintAndApprove(token, hashBet, p, MIN_BET);
      await hashBet.connect(p).placeBet(true, MIN_BET);
    }
    expect(await hashBet.totalPool()).to.equal(poolBefore + MIN_BET * 3n);
  });

  it("settling one player's bet does not affect another's unsettled bet", async () => {
    const signers = await ethers.getSigners();
    const [, p1, p2] = signers;
    await mintAndApprove(token, hashBet, p1, MIN_BET);
    await mintAndApprove(token, hashBet, p2, MIN_BET);
    await hashBet.connect(p1).placeBet(true, MIN_BET);
    await hashBet.connect(p2).placeBet(false, MIN_BET);
    await mineBlocks(2);
    await hashBet.settleBet(0n);
    const p2Bet = await hashBet.bets(1n);
    expect(p2Bet.settled).to.be.false;
  });

  it("ten consecutive bets from same player all recorded", async () => {
    const [, player] = await ethers.getSigners();
    const total = 10n;
    await mintAndApprove(token, hashBet, player, MIN_BET * total);
    for (let i = 0n; i < total; i++) {
      await hashBet.connect(player).placeBet(i % 2n === 0n, MIN_BET);
    }
    const bets = await hashBet.getPlayerBets(player.address);
    expect(BigInt(bets.length)).to.equal(total);
  });
});
