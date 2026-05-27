const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");

describe("HashBet – Bet Placement (success paths)", () => {
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

  it("places a Big bet with minimum amount", async () => {
    await expect(hashBet.connect(player).placeBet(true, MIN_BET)).to.not.be.reverted;
  });

  it("places a Small bet with minimum amount", async () => {
    await expect(hashBet.connect(player).placeBet(false, MIN_BET)).to.not.be.reverted;
  });

  it("places a bet with maximum amount", async () => {
    await expect(hashBet.connect(player).placeBet(true, MAX_BET)).to.not.be.reverted;
  });

  it("increments totalBetsPlaced after a bet", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    expect(await hashBet.totalBetsPlaced()).to.equal(1n);
  });

  it("increases totalPool by bet amount after placement", async () => {
    const poolBefore = await hashBet.totalPool();
    await hashBet.connect(player).placeBet(true, MIN_BET);
    expect(await hashBet.totalPool()).to.equal(poolBefore + MIN_BET);
  });

  it("assigns bet to block.number + 1", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    const currentBlock = await ethers.provider.getBlockNumber();
    const bet = await hashBet.bets(0n);
    expect(bet.blockNumber).to.equal(BigInt(currentBlock));
  });

  it("records player address on the bet", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    const bet = await hashBet.bets(0n);
    expect(bet.player).to.equal(player.address);
  });

  it("records isBig correctly for Big bet", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    const bet = await hashBet.bets(0n);
    expect(bet.isBig).to.be.true;
  });

  it("records isBig correctly for Small bet", async () => {
    await hashBet.connect(player).placeBet(false, MIN_BET);
    const bet = await hashBet.bets(0n);
    expect(bet.isBig).to.be.false;
  });

  it("adds betId to playerBets mapping", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    const bets = await hashBet.getPlayerBets(player.address);
    expect(bets.length).to.equal(1);
    expect(bets[0]).to.equal(0n);
  });

  it("emits BetPlaced event with correct args", async () => {
    const blockNumber = await ethers.provider.getBlockNumber();
    await expect(hashBet.connect(player).placeBet(true, MIN_BET))
      .to.emit(hashBet, "BetPlaced")
      .withArgs(0n, player.address, MIN_BET, true, BigInt(blockNumber) + 1n);
  });

  it("transfers bet amount from player to contract", async () => {
    const playerBefore = await token.balanceOf(player.address);
    await hashBet.connect(player).placeBet(true, MIN_BET);
    expect(await token.balanceOf(player.address)).to.equal(playerBefore - MIN_BET);
  });
});
