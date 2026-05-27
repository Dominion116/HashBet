require("../setup");
const store = require("../../src/config/runtimeStore");

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("Leaderboard controller – via runtime store", () => {
  it("returns empty array when no data exists", () => {
    const result = store.getLeaderboard("week", 50);
    expect(result).toHaveLength(0);
  });

  it("aggregates win counts correctly", () => {
    const user = store.createUser("0xlboard0000000000000000000000000001");
    store.createBet(user.id, { hash: "h1", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    store.createBet(user.id, { hash: "h2", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    store.createBet(user.id, { hash: "h3", choice: "Small", amount: 0.02, payout: 0, result: "lose" });
    const result = store.getLeaderboard("alltime", 10);
    expect(result[0].wins).toBe(2);
    expect(result[0].total_bets).toBe(3);
  });

  it("calculates win_rate as percentage", () => {
    const user = store.createUser("0xlboard0000000000000000000000000002");
    store.createBet(user.id, { hash: "h1", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    store.createBet(user.id, { hash: "h2", choice: "Small", amount: 0.02, payout: 0, result: "lose" });
    store.createBet(user.id, { hash: "h3", choice: "Small", amount: 0.02, payout: 0, result: "lose" });
    store.createBet(user.id, { hash: "h4", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    const result = store.getLeaderboard("alltime", 10);
    expect(result[0].win_rate).toBe(50);
  });

  it("sorts by net profit descending", () => {
    const u1 = store.createUser("0xlboard0000000000000000000000000003");
    const u2 = store.createUser("0xlboard0000000000000000000000000004");
    store.createBet(u1.id, { hash: "h1", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    store.createBet(u2.id, { hash: "h2", choice: "Small", amount: 0.02, payout: 0, result: "lose" });
    const result = store.getLeaderboard("alltime", 10);
    expect(result[0].address).toBe(u1.address);
  });

  it("caps results at provided limit", () => {
    for (let i = 0; i < 10; i++) {
      const user = store.createUser(`0x${i}lboard000000000000000000000000000${i}`);
      store.createBet(user.id, { hash: `0x${i}`, choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    }
    expect(store.getLeaderboard("alltime", 3)).toHaveLength(3);
  });
});
