const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HashBet", () => {
  let hashBet;
  let owner;
  let player1;

  beforeEach(async () => {
    [owner, player1] = await ethers.getSigners();

    const HashBet = await ethers.getContractFactory("HashBet");
    hashBet = await HashBet.deploy();
    await hashBet.waitForDeployment();

    // Fund pool
    await hashBet.fundPool({
      value: ethers.parseEther("1000"),
    });
  });

  describe("Betting", () => {
    it("Should allow placing a bet", async () => {
      const betAmount = ethers.parseEther("0.02");
      await expect(
        hashBet.connect(player1).placeBet(true, { value: betAmount })
      ).to.emit(hashBet, "BetPlaced");
    });

    it("Should reject bets below minimum", async () => {
      const tinyAmount = ethers.parseEther("0.01");
      await expect(
        hashBet.connect(player1).placeBet(true, { value: tinyAmount })
      ).to.be.revertedWith("Bet too small");
    });

    it("Should reject bets above maximum", async () => {
      const hugeAmount = ethers.parseEther("0.11");
      await expect(
        hashBet.connect(player1).placeBet(true, { value: hugeAmount })
      ).to.be.revertedWith("Bet too large");
    });
  });

  describe("Pool", () => {
    it("Should fund the pool", async () => {
      const initialPool = await hashBet.totalPool();
      const fundAmount = ethers.parseEther("100");

      await hashBet.fundPool({ value: fundAmount });

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

        await hashBet.connect(player1).placeBet(true, { value: betAmount });
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
