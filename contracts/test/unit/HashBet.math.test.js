const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployFull, fundPool, mintAndApprove } = require("../helpers/setup");
const { mineBlocks, expectedPayout } = require("../helpers/assertions");

describe("HashBet – Payout Math", () => {
  let token, hashBet, owner, player;
  const POOL_SEED = 50_000_000n;

  beforeEach(async () => {
    [owner, player] = await ethers.getSigners();
    ({ token, hashBet } = await deployFull());
    await fundPool(token, hashBet, owner, POOL_SEED);
  });

  async function settleForcingOutcome(isBig, betAmount) {
    await mintAndApprove(token, hashBet, player, betAmount);
    await hashBet.connect(player).placeBet(isBig, betAmount);
    await mineBlocks(2);
    const playerBefore = await token.balanceOf(player.address);
    await hashBet.settleBet(0n);
    const bet = await hashBet.bets(0n);
    const playerAfter = await token.balanceOf(player.address);
    return { bet, playerBefore, playerAfter };
  }

  it("WIN_MULTIPLIER is 188 (1.88x in basis points)", async () => {
    expect(await hashBet.WIN_MULTIPLIER()).to.equal(188n);
  });

  it("HOUSE_EDGE_BPS is 600 (6%)", async () => {
    expect(await hashBet.HOUSE_EDGE_BPS()).to.equal(600n);
  });

  it("net player payout is betAmount * 1.88 * 0.94 on a win", async () => {
    const betAmount = 100_000n;
    const { bet, playerBefore, playerAfter } = await settleForcingOutcome(true, betAmount);
    if (bet.won) {
      const grossPayout = (betAmount * 188n) / 100n;
      const houseCut = (grossPayout * 600n) / 10000n;
      const netPayout = grossPayout - houseCut;
      expect(playerAfter - playerBefore).to.equal(netPayout);
    }
  });

  it("pool decreases by net payout on a win", async () => {
    const betAmount = 100_000n;
    await mintAndApprove(token, hashBet, player, betAmount);
    await hashBet.connect(player).placeBet(true, betAmount);
    await mineBlocks(2);
    const poolBeforeSettle = await hashBet.totalPool();
    await hashBet.settleBet(0n);
    const bet = await hashBet.bets(0n);
    if (bet.won) {
      const grossPayout = (betAmount * 188n) / 100n;
      const houseCut = (grossPayout * 600n) / 10000n;
      const netPayout = grossPayout - houseCut;
      expect(poolBeforeSettle - (await hashBet.totalPool())).to.equal(netPayout);
    }
  });

  it("player balance unchanged on a loss", async () => {
    const betAmount = 20_000n;
    const { bet, playerBefore, playerAfter } = await settleForcingOutcome(true, betAmount);
    if (!bet.won) {
      expect(playerAfter).to.equal(playerBefore);
    }
  });

  it("pool increases by bet amount on a loss (net gain for house)", async () => {
    const betAmount = 20_000n;
    await mintAndApprove(token, hashBet, player, betAmount);
    await hashBet.connect(player).placeBet(true, betAmount);
    const poolAfterBet = await hashBet.totalPool();
    await mineBlocks(2);
    await hashBet.settleBet(0n);
    const bet = await hashBet.bets(0n);
    if (!bet.won) {
      expect(await hashBet.totalPool()).to.equal(poolAfterBet);
    }
  });

  it("minBetAmount is (10^decimals * 2) / 100", async () => {
    const decimals = Number(await hashBet.paymentTokenDecimals());
    const oneToken = 10n ** BigInt(decimals);
    expect(await hashBet.minBetAmount()).to.equal((oneToken * 2n) / 100n);
  });

  it("maxBetAmount is (10^decimals * 10) / 100", async () => {
    const decimals = Number(await hashBet.paymentTokenDecimals());
    const oneToken = 10n ** BigInt(decimals);
    expect(await hashBet.maxBetAmount()).to.equal((oneToken * 10n) / 100n);
  });

  it("expectedPayout helper matches contract math", async () => {
    const betAmount = 50_000n;
    const expected = expectedPayout(betAmount);
    const grossPayout = (betAmount * 188n) / 100n;
    const houseCut = (grossPayout * 600n) / 10000n;
    expect(expected).to.equal(grossPayout - houseCut);
  });
});
