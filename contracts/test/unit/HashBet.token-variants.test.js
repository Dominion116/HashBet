const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, deployMockERC20, deployHashBet, fundPool } = require("../helpers/setup");

describe("HashBet – Token Variant Compatibility", () => {
  it("works with a 6-decimal token (USDC)", async () => {
    const { hashBet } = await deployFull(6);
    expect(await hashBet.paymentTokenDecimals()).to.equal(6);
    const minBet = await hashBet.minBetAmount();
    expect(minBet).to.equal(20_000n);
  });

  it("works with an 18-decimal token", async () => {
    const token = await deployMockERC20(18);
    const hb = await deployHashBet(await token.getAddress(), "DAI");
    expect(await hb.paymentTokenDecimals()).to.equal(18);
    const oneToken = 10n ** 18n;
    expect(await hb.minBetAmount()).to.equal((oneToken * 2n) / 100n);
  });

  it("works with an 8-decimal token (WBTC)", async () => {
    const token = await deployMockERC20(8);
    const hb = await deployHashBet(await token.getAddress(), "WBTC");
    expect(await hb.paymentTokenDecimals()).to.equal(8);
    const oneToken = 10n ** 8n;
    expect(await hb.minBetAmount()).to.equal((oneToken * 2n) / 100n);
  });

  it("accepts a fund and bet with an 18-decimal token", async () => {
    const [owner, player] = await ethers.getSigners();
    const token = await deployMockERC20(18);
    const hb = await deployHashBet(await token.getAddress(), "DAI");
    const oneToken = 10n ** 18n;
    const minBet = (oneToken * 2n) / 100n;
    await fundPool(token, hb, owner, oneToken * 10n);
    await token.mint(player.address, minBet);
    await token.connect(player).approve(await hb.getAddress(), minBet);
    await expect(hb.connect(player).placeBet(true, minBet)).to.not.be.reverted;
  });
});
