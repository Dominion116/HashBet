const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HashBet", () => {
  let hashBet;
  let token;
  let owner;
  let player1;

  beforeEach(async () => {
    [owner, player1] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("cUSD", "cUSD");
    await token.waitForDeployment();

    await token.mint(owner.address, ethers.parseEther("2000"));
    await token.mint(player1.address, ethers.parseEther("2000"));

    const HashBet = await ethers.getContractFactory("HashBet");
    hashBet = await HashBet.deploy(await token.getAddress(), "cUSD");
    await hashBet.waitForDeployment();

    // Fund pool
    await token.connect(owner).approve(await hashBet.getAddress(), ethers.parseEther("1000"));
    await hashBet.fundPool(ethers.parseEther("1000"));
  });

  describe("Betting", () => {
    it("Should allow placing a bet", async () => {
      const betAmount = ethers.parseEther("0.02");
      await token.connect(player1).approve(await hashBet.getAddress(), betAmount);
      await expect(
        hashBet.connect(player1).placeBet(true, betAmount)
      ).to.emit(hashBet, "BetPlaced");
    });

    it("Should reject bets below minimum", async () => {
      const tinyAmount = ethers.parseEther("0.01");
      await token.connect(player1).approve(await hashBet.getAddress(), tinyAmount);
      await expect(
        hashBet.connect(player1).placeBet(true, tinyAmount)
      ).to.be.revertedWith("Bet too small");
    });

    it("Should reject bets above maximum", async () => {
      const hugeAmount = ethers.parseEther("0.11");
      await token.connect(player1).approve(await hashBet.getAddress(), hugeAmount);
      await expect(
        hashBet.connect(player1).placeBet(true, hugeAmount)
      ).to.be.revertedWith("Bet too large");
    });
  });

  describe("Pool", () => {
    it("Should fund the pool", async () => {
      const initialPool = await hashBet.totalPool();
      const fundAmount = ethers.parseEther("100");

      await token.connect(owner).approve(await hashBet.getAddress(), fundAmount);
      await hashBet.fundPool(fundAmount);

      const newPool = await hashBet.totalPool();
      expect(newPool).to.equal(initialPool + fundAmount);
    });

    it("Should allow owner to withdraw", async () => {
      const withdrawAmount = ethers.parseEther("100");
      await hashBet.withdrawFromPool(withdrawAmount);

      const newPool = await hashBet.totalPool();
      expect(newPool).to.be.closeTo(
        ethers.parseEther("900"),
        ethers.parseEther("1")
      );
    });

    it("Should keep stake in pool on a losing settlement", async () => {
      const betAmount = ethers.parseEther("0.02");

      for (let attempt = 0; attempt < 20; attempt++) {
        const poolBefore = await hashBet.totalPool();
        const betId = await hashBet.totalBetsPlaced();

        await token.connect(player1).approve(await hashBet.getAddress(), betAmount);
        await hashBet.connect(player1).placeBet(true, betAmount);
        await ethers.provider.send("evm_mine", []);
        await hashBet.settleBet(betId);

        const [, , , settled, won] = await hashBet.getBetDetails(betId);
        expect(settled).to.equal(true);

        if (!won) {
          const poolAfter = await hashBet.totalPool();
          expect(poolAfter).to.equal(poolBefore + betAmount);
          return;
        }
      }

      throw new Error("Could not produce a losing bet after 20 attempts");
    });
  });
});
