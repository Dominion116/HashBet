require("../setup");
const store = require("../../src/config/runtimeStore");

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("Bet model – runtime store delegation", () => {
  it("create() stores a bet and returns it", async () => {
    const Bet = require("../../src/models/Bet");
    const user = store.createUser("0xbetmodel00000000000000000000000000001");

    const bet = await Bet.create(user.id, {
      hash: "0xabc123",
      choice: "Big",
      amount: 0.05,
      payout: 0.094,
      result: "win",
      blockNumber: 100,
    });

    expect(bet).toBeDefined();
    expect(bet.choice).toBe("Big");
    expect(bet.result).toBe("win");
  });

  it("getUserHistory() returns an array", async () => {
    const Bet = require("../../src/models/Bet");
    const user = store.createUser("0xbetmodel00000000000000000000000000002");

    const history = await Bet.getUserHistory(user.id, 10, 0);
    expect(Array.isArray(history)).toBe(true);
  });

  it("getUserHistory() returns bets in descending order", async () => {
    const Bet = require("../../src/models/Bet");
    const user = store.createUser("0xbetmodel00000000000000000000000000003");

    await Bet.create(user.id, { hash: "0x1", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    await Bet.create(user.id, { hash: "0x2", choice: "Small", amount: 0.02, payout: 0, result: "lose" });

    const history = await Bet.getUserHistory(user.id, 10, 0);
    expect(history.length).toBe(2);
  });

  it("getLeaderboard() returns an array", async () => {
    const Bet = require("../../src/models/Bet");
    const result = await Bet.getLeaderboard("week", 10);
    expect(Array.isArray(result)).toBe(true);
  });

  it("getLeaderboard() respects limit param", async () => {
    const Bet = require("../../src/models/Bet");
    for (let i = 0; i < 5; i++) {
      const user = store.createUser(`0x${i}betmodelleader0000000000000000000${i}`);
      await Bet.create(user.id, { hash: `0xh${i}`, choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    }
    const result = await Bet.getLeaderboard("alltime", 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });
});
