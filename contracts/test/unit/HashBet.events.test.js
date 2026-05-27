const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");
const { mineBlocks } = require("../helpers/assertions");

describe("HashBet – Event Emissions", () => {
  let token, hashBet, owner, player;
  const MIN_BET = 20_000n;
  const POOL_SEED = 10_000_000n;

  beforeEach(async () => {
    [owner, player] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
    await mintAndApprove(token, hashBet, player, MIN_BET * 10n);
  });

  it("emits PoolFunded with funder address and amount", async () => {
    const amount = 1_000_000n;
    await token.mint(player.address, amount);
    await token.connect(player).approve(await hashBet.getAddress(), amount);
    await expect(hashBet.connect(player).fundPool(amount))
      .to.emit(hashBet, "PoolFunded")
      .withArgs(player.address, amount);
  });

  it("emits PoolWithdrawn with owner address and amount", async () => {
    await expect(hashBet.connect(owner).withdrawFromPool(500_000n))
      .to.emit(hashBet, "PoolWithdrawn")
      .withArgs(owner.address, 500_000n);
  });

  it("emits BetPlaced with betId, player, amount, isBig, blockNumber", async () => {
    const blockNum = await ethers.provider.getBlockNumber();
    await expect(hashBet.connect(player).placeBet(true, MIN_BET))
      .to.emit(hashBet, "BetPlaced")
      .withArgs(0n, player.address, MIN_BET, true, BigInt(blockNum) + 1n);
  });

  it("emits BetPlaced with correct isBig=false for Small bet", async () => {
    const blockNum = await ethers.provider.getBlockNumber();
    await expect(hashBet.connect(player).placeBet(false, MIN_BET))
      .to.emit(hashBet, "BetPlaced")
      .withArgs(0n, player.address, MIN_BET, false, BigInt(blockNum) + 1n);
  });

  it("emits BetSettled after settlement", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await mineBlocks(2);
    await expect(hashBet.settleBet(0n)).to.emit(hashBet, "BetSettled");
  });

  it("BetSettled event contains betId and player address", async () => {
    await hashBet.connect(player).placeBet(true, MIN_BET);
    await mineBlocks(2);
    const tx = await hashBet.settleBet(0n);
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (l) => l.fragment && l.fragment.name === "BetSettled"
    );
    expect(event).to.not.be.undefined;
    expect(event.args[0]).to.equal(0n);
    expect(event.args[1]).to.equal(player.address);
  });
});
