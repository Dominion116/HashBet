const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool } = require("../helpers/setup");

describe("HashBet – Access Control", () => {
  let token, hashBet, owner, stranger;

  beforeEach(async () => {
    [owner, stranger] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, 5_000_000n);
  });

  it("allows owner to withdraw from pool", async () => {
    await expect(
      hashBet.connect(owner).withdrawFromPool(100_000n)
    ).to.not.be.reverted;
  });

  it("blocks non-owner from withdrawing from pool", async () => {
    await expect(
      hashBet.connect(stranger).withdrawFromPool(100_000n)
    ).to.be.revertedWith("Only owner");
  });

  it("records deployer as owner", async () => {
    expect(await hashBet.owner()).to.equal(owner.address);
  });

  it("owner is not the zero address", async () => {
    expect(await hashBet.owner()).to.not.equal(ethers.ZeroAddress);
  });

  it("allows any address to fund the pool", async () => {
    const amount = 1_000_000n;
    await token.mint(stranger.address, amount);
    await token.connect(stranger).approve(await hashBet.getAddress(), amount);
    await expect(
      hashBet.connect(stranger).fundPool(amount)
    ).to.not.be.reverted;
  });

  it("allows any address to place a bet", async () => {
    const amount = 20_000n;
    await token.mint(stranger.address, amount);
    await token.connect(stranger).approve(await hashBet.getAddress(), amount);
    await expect(
      hashBet.connect(stranger).placeBet(true, amount)
    ).to.not.be.reverted;
  });

  it("allows any address to call settleBet", async () => {
    const amount = 20_000n;
    await token.mint(stranger.address, amount);
    await token.connect(stranger).approve(await hashBet.getAddress(), amount);
    await hashBet.connect(stranger).placeBet(true, amount);
    await ethers.provider.send("evm_mine", []);
    await ethers.provider.send("evm_mine", []);
    await expect(hashBet.connect(owner).settleBet(0n)).to.not.be.reverted;
  });
});
