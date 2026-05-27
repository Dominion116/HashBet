const { expect } = require("chai");
const { deployFull } = require("../helpers/setup");

describe("HashBet – Contract Constants", () => {
  let hashBet;

  before(async () => {
    ({ hashBet } = await deployFull());
  });

  it("WIN_MULTIPLIER equals 188", async () => {
    expect(await hashBet.WIN_MULTIPLIER()).to.equal(188n);
  });

  it("HOUSE_EDGE_BPS equals 600", async () => {
    expect(await hashBet.HOUSE_EDGE_BPS()).to.equal(600n);
  });

  it("WIN_MULTIPLIER represents a 1.88x multiplier", async () => {
    const mult = Number(await hashBet.WIN_MULTIPLIER());
    expect(mult / 100).to.equal(1.88);
  });

  it("HOUSE_EDGE_BPS represents exactly 6%", async () => {
    const bps = Number(await hashBet.HOUSE_EDGE_BPS());
    expect(bps / 100).to.equal(6);
  });

  it("effective player return rate is 1.88 * 0.94 = 1.7672", async () => {
    const mult = Number(await hashBet.WIN_MULTIPLIER()) / 100;
    const edgeBps = Number(await hashBet.HOUSE_EDGE_BPS());
    const houseEdge = edgeBps / 10000;
    const playerReturn = mult * (1 - houseEdge);
    expect(playerReturn).to.be.closeTo(1.7672, 0.0001);
  });

  it("minBetAmount is less than maxBetAmount", async () => {
    const min = await hashBet.minBetAmount();
    const max = await hashBet.maxBetAmount();
    expect(min).to.be.lt(max);
  });

  it("maxBetAmount is exactly 5x the minBetAmount", async () => {
    const min = await hashBet.minBetAmount();
    const max = await hashBet.maxBetAmount();
    expect(max).to.equal(min * 5n);
  });
});
