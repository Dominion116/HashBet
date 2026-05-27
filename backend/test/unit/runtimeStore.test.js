require("../setup");
const store = require("../../src/config/runtimeStore");

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("runtimeStore – createUser", () => {
  it("creates a new user with the provided address", () => {
    const user = store.createUser("0xABCD");
    expect(user.address).toBe("0xabcd");
  });

  it("normalises address to lowercase", () => {
    const user = store.createUser("0xDEADBEEF");
    expect(user.address).toBe("0xdeadbeef");
  });

  it("returns the same user on duplicate address", () => {
    const a = store.createUser("0x1111");
    const b = store.createUser("0x1111");
    expect(a.id).toBe(b.id);
  });

  it("assigns a unique id to each user", () => {
    const a = store.createUser("0xAAAA");
    const b = store.createUser("0xBBBB");
    expect(a.id).not.toBe(b.id);
  });
});

describe("runtimeStore – findUserByAddress", () => {
  it("returns undefined for unknown address", () => {
    expect(store.findUserByAddress("0xunknown")).toBeUndefined();
  });

  it("finds a user after creation", () => {
    store.createUser("0x1234");
    const user = store.findUserByAddress("0x1234");
    expect(user).toBeDefined();
    expect(user.address).toBe("0x1234");
  });
});

describe("runtimeStore – createBet", () => {
  it("creates a bet with all required fields", () => {
    const user = store.createUser("0xPLAYER");
    const bet = store.createBet(user.id, {
      hash: "0xhash",
      choice: "Big",
      amount: 0.05,
      payout: 0.094,
      result: "win",
      blockNumber: 100,
    });
    expect(bet.choice).toBe("Big");
    expect(bet.result).toBe("win");
    expect(bet.user_id).toBe(user.id);
  });
});

describe("runtimeStore – getUserBets", () => {
  it("returns empty array when user has no bets", () => {
    const user = store.createUser("0xEMPTY");
    expect(store.getUserBets(user.id)).toHaveLength(0);
  });

  it("returns bets for the correct user only", () => {
    const u1 = store.createUser("0xU1");
    const u2 = store.createUser("0xU2");
    store.createBet(u1.id, { hash: "h1", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    store.createBet(u2.id, { hash: "h2", choice: "Small", amount: 0.02, payout: 0, result: "lose" });
    expect(store.getUserBets(u1.id)).toHaveLength(1);
    expect(store.getUserBets(u2.id)).toHaveLength(1);
  });

  it("respects limit parameter", () => {
    const user = store.createUser("0xLIMIT");
    for (let i = 0; i < 10; i++) {
      store.createBet(user.id, { hash: `0x${i}`, choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    }
    expect(store.getUserBets(user.id, 3)).toHaveLength(3);
  });
});

describe("runtimeStore – getUserStats", () => {
  it("returns zeros for user with no bets", () => {
    const user = store.createUser("0xNOBETS");
    const stats = store.getUserStats(user.id);
    expect(stats.total_bets).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
  });

  it("counts wins and losses correctly", () => {
    const user = store.createUser("0xSTATS");
    store.createBet(user.id, { hash: "h1", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    store.createBet(user.id, { hash: "h2", choice: "Small", amount: 0.02, payout: 0, result: "lose" });
    const stats = store.getUserStats(user.id);
    expect(stats.wins).toBe(1);
    expect(stats.losses).toBe(1);
    expect(stats.total_bets).toBe(2);
  });
});

describe("runtimeStore – getLeaderboard", () => {
  it("returns empty array when no bets exist", () => {
    expect(store.getLeaderboard("week", 10)).toHaveLength(0);
  });

  it("returns at most limit entries", () => {
    for (let i = 0; i < 5; i++) {
      const user = store.createUser(`0x${i}00000000000000000000`);
      store.createBet(user.id, { hash: `0x${i}`, choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    }
    expect(store.getLeaderboard("alltime", 3)).toHaveLength(3);
  });
});
