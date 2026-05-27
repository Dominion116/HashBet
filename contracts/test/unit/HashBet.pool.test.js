const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");

describe("HashBet – Pool Management", () => {
  let token, hashBet, owner, funder;

  beforeEach(async () => {
    [owner, funder] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
  });

  describe("fundPool", () => {
    it("increases totalPool by funded amount", async () => {
      const amount = 1_000_000n;
      await token.mint(funder.address, amount);
      await token.connect(funder).approve(await hashBet.getAddress(), amount);
      await hashBet.connect(funder).fundPool(amount);
      expect(await hashBet.totalPool()).to.equal(amount);
    });

    it("accepts multiple sequential fund calls", async () => {
      const amount = 500_000n;
      for (let i = 0; i < 3; i++) {
        await token.mint(funder.address, amount);
        await token.connect(funder).approve(await hashBet.getAddress(), amount);
        await hashBet.connect(funder).fundPool(amount);
      }
      expect(await hashBet.totalPool()).to.equal(amount * 3n);
    });

    it("reverts when amount is zero", async () => {
      await expect(hashBet.connect(funder).fundPool(0n)).to.be.revertedWith(
        "Amount required"
      );
    });

    it("reverts when allowance is insufficient", async () => {
      const amount = 1_000_000n;
      await token.mint(funder.address, amount);
      await expect(hashBet.connect(funder).fundPool(amount)).to.be.revertedWith(
        "Insufficient allowance"
      );
    });

    it("emits PoolFunded event with correct args", async () => {
      const amount = 1_000_000n;
      await token.mint(funder.address, amount);
      await token.connect(funder).approve(await hashBet.getAddress(), amount);
      await expect(hashBet.connect(funder).fundPool(amount))
        .to.emit(hashBet, "PoolFunded")
        .withArgs(funder.address, amount);
    });
  });

  describe("withdrawFromPool", () => {
    beforeEach(async () => {
      await fundPool(token, hashBet, funder, 2_000_000n);
    });

    it("decreases totalPool by withdrawn amount", async () => {
      const before = await hashBet.totalPool();
      await hashBet.connect(owner).withdrawFromPool(500_000n);
      expect(await hashBet.totalPool()).to.equal(before - 500_000n);
    });

    it("transfers tokens to owner", async () => {
      const ownerBefore = await token.balanceOf(owner.address);
      await hashBet.connect(owner).withdrawFromPool(500_000n);
      expect(await token.balanceOf(owner.address)).to.equal(ownerBefore + 500_000n);
    });

    it("allows owner to withdraw full pool balance", async () => {
      const pool = await hashBet.totalPool();
      await hashBet.connect(owner).withdrawFromPool(pool);
      expect(await hashBet.totalPool()).to.equal(0n);
    });

    it("reverts when non-owner calls withdraw", async () => {
      await expect(
        hashBet.connect(funder).withdrawFromPool(100_000n)
      ).to.be.revertedWith("Only owner");
    });

    it("reverts when withdraw amount exceeds pool", async () => {
      const pool = await hashBet.totalPool();
      await expect(
        hashBet.connect(owner).withdrawFromPool(pool + 1n)
      ).to.be.revertedWith("Insufficient pool");
    });

    it("emits PoolWithdrawn event with correct args", async () => {
      await expect(hashBet.connect(owner).withdrawFromPool(500_000n))
        .to.emit(hashBet, "PoolWithdrawn")
        .withArgs(owner.address, 500_000n);
    });
  });
});
