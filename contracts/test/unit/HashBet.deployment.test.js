const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, deployHashBet, deployMockERC20 } = require("../helpers/setup");

describe("HashBet – Deployment", () => {
  let token, hashBet;

  beforeEach(async () => {
    ({ token, hashBet } = await deployFull());
  });

  it("stores the payment token address", async () => {
    expect(await hashBet.paymentToken()).to.equal(await token.getAddress());
  });

  it("stores the payment token symbol", async () => {
    expect(await hashBet.paymentTokenSymbol()).to.equal("USDC");
  });

  it("stores the correct token decimals", async () => {
    expect(await hashBet.paymentTokenDecimals()).to.equal(6);
  });

  it("sets minBetAmount to 0.02 tokens", async () => {
    const oneToken = 10n ** 6n;
    expect(await hashBet.minBetAmount()).to.equal((oneToken * 2n) / 100n);
  });

  it("sets maxBetAmount to 0.1 tokens", async () => {
    const oneToken = 10n ** 6n;
    expect(await hashBet.maxBetAmount()).to.equal((oneToken * 10n) / 100n);
  });

  it("sets owner to deployer", async () => {
    const [deployer] = await ethers.getSigners();
    expect(await hashBet.owner()).to.equal(deployer.address);
  });

  it("initializes totalPool at zero", async () => {
    expect(await hashBet.totalPool()).to.equal(0n);
  });

  it("initializes totalBetsPlaced at zero", async () => {
    expect(await hashBet.totalBetsPlaced()).to.equal(0n);
  });

  it("initializes totalBetsWon at zero", async () => {
    expect(await hashBet.totalBetsWon()).to.equal(0n);
  });

  it("exposes correct WIN_MULTIPLIER constant", async () => {
    expect(await hashBet.WIN_MULTIPLIER()).to.equal(188n);
  });

  it("exposes correct HOUSE_EDGE_BPS constant", async () => {
    expect(await hashBet.HOUSE_EDGE_BPS()).to.equal(600n);
  });

  it("reverts when deployed with zero address token", async () => {
    const HashBet = await ethers.getContractFactory("HashBet");
    await expect(
      HashBet.deploy(ethers.ZeroAddress, "USDC")
    ).to.be.revertedWith("Token required");
  });

  it("supports tokens with 8 decimals", async () => {
    const token8 = await deployMockERC20(8);
    const hb = await deployHashBet(await token8.getAddress(), "WBTC");
    expect(await hb.paymentTokenDecimals()).to.equal(8);
    const oneToken = 10n ** 8n;
    expect(await hb.minBetAmount()).to.equal((oneToken * 2n) / 100n);
  });
});
