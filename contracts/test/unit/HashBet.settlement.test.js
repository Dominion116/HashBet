const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");
const { mineBlocks } = require("../helpers/assertions");

describe("HashBet – Bet Settlement", () => {
  let token, hashBet, owner, player;
  const MIN_BET = 20_000n;
  const POOL_SEED = 10_000_000n;

  beforeEach(async () => {
    [owner, player] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
    await mintAndApprove(token, hashBet, player, MIN_BET * 20n);
  });

  async function placeBetAndMine(isBig = true) {
    await hashBet.connect(player).placeBet(isBig, MIN_BET);
    await mineBlocks(2);
    return 0n;
  }

  it("marks bet as settled after settleBet call", async () => {
    const betId = await placeBetAndMine();
    await hashBet.settleBet(betId);
    const bet = await hashBet.bets(betId);
    expect(bet.settled).to.be.true;
  });

  it("records blockHash on the bet after settlement", async () => {
    const betId = await placeBetAndMine();
    await hashBet.settleBet(betId);
    const bet = await hashBet.bets(betId);
    expect(bet.blockHash).to.not.equal(ethers.ZeroHash);
  });

  it("pays out player on win and reduces pool", async () => {
    const betId = await placeBetAndMine(true);
    const poolBefore = await hashBet.totalPool();
    const playerBefore = await token.balanceOf(player.address);

    await hashBet.settleBet(betId);
    const bet = await hashBet.bets(betId);

    if (bet.won) {
      expect(await token.balanceOf(player.address)).to.be.gt(playerBefore);
      expect(await hashBet.totalPool()).to.be.lt(poolBefore);
    }
  });

  it("does not pay out on loss", async () => {
    const betId = await placeBetAndMine(true);
    const playerBefore = await token.balanceOf(player.address);

    await hashBet.settleBet(betId);
    const bet = await hashBet.bets(betId);

    if (!bet.won) {
      expect(await token.balanceOf(player.address)).to.equal(playerBefore);
    }
  });

  it("increments totalBetsWon only on a win", async () => {
    const betId = await placeBetAndMine(true);
    const wonBefore = await hashBet.totalBetsWon();
    await hashBet.settleBet(betId);
    const bet = await hashBet.bets(betId);
    if (bet.won) {
      expect(await hashBet.totalBetsWon()).to.equal(wonBefore + 1n);
    } else {
      expect(await hashBet.totalBetsWon()).to.equal(wonBefore);
    }
  });

  it("emits BetSettled event after settlement", async () => {
    const betId = await placeBetAndMine();
    await expect(hashBet.settleBet(betId)).to.emit(hashBet, "BetSettled");
  });

  it("reverts when block has not been mined yet", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await expect(hashBet.settleBet(0n)).to.be.revertedWith("Block not mined yet");
  });

  it("reverts when settling an already-settled bet", async () => {
    const betId = await placeBetAndMine();
    await hashBet.settleBet(betId);
    await expect(hashBet.settleBet(betId)).to.be.revertedWith("Already settled");
  });
});
