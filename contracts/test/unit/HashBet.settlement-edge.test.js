const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");
const { mineBlocks } = require("../helpers/assertions");

describe("HashBet – Settlement Edge Cases", () => {
  let token, hashBet, owner, player;
  const MIN_BET = 20_000n;
  const POOL_SEED = 10_000_000n;

  beforeEach(async () => {
    [owner, player] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
    await mintAndApprove(token, hashBet, player, MIN_BET * 20n);
  });

  it("cannot settle a bet placed in the current block", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await expect(hashBet.settleBet(0n)).to.be.revertedWith("Block not mined yet");
  });

  it("second settleBet call on same betId always reverts", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await mineBlocks(2);
    await hashBet.settleBet(0n);
    await expect(hashBet.settleBet(0n)).to.be.revertedWith("Already settled");
  });

  it("sequential bets from same player get consecutive IDs", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await hashBet.connect(player).placeBet(false, MIN_BET);
    const bets = await hashBet.getPlayerBets(player.address);
    expect(bets[0]).to.equal(0n);
    expect(bets[1]).to.equal(1n);
  });

  it("bet won field is false before settlement", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    const bet = await hashBet.bets(0n);
    expect(bet.won).to.be.false;
    expect(bet.settled).to.be.false;
  });

  it("totalBetsPlaced does not change after settlement", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await mineBlocks(2);
    const placed = await hashBet.totalBetsPlaced();
    await hashBet.settleBet(0n);
    expect(await hashBet.totalBetsPlaced()).to.equal(placed);
  });

  it("pool increases by bet amount before settlement", async () => {
    const poolBefore = await hashBet.totalPool();
    await hashBet.connect(player).placeBet(true, MIN_BET);
    expect(await hashBet.totalPool()).to.equal(poolBefore + MIN_BET);
  });

  it("any account can call settleBet on any betId", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await mineBlocks(2);
    const [, , thirdParty] = await ethers.getSigners();
    await expect(hashBet.connect(thirdParty).settleBet(0n)).to.not.be.reverted;
  });
});
