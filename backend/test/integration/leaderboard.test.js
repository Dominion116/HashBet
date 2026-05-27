require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");
const store = require("../../src/config/runtimeStore");

const app = buildApp();

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("GET /api/leaderboard", () => {
  it("returns 200 status", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.status).toBe(200);
  });

  it("returns success: true", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.body.success).toBe(true);
  });

  it("returns an array in data field", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("accepts period=day query param", async () => {
    const res = await request(app).get("/api/leaderboard?period=day");
    expect(res.status).toBe(200);
  });

  it("accepts period=week query param", async () => {
    const res = await request(app).get("/api/leaderboard?period=week");
    expect(res.status).toBe(200);
  });

  it("accepts period=month query param", async () => {
    const res = await request(app).get("/api/leaderboard?period=month");
    expect(res.status).toBe(200);
  });

  it("accepts period=alltime query param", async () => {
    const res = await request(app).get("/api/leaderboard?period=alltime");
    expect(res.status).toBe(200);
  });

  it("returns empty array when no bets exist", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.body.data).toHaveLength(0);
  });

  it("populates leaderboard from runtime store data", async () => {
    const user = store.createUser("0xleader0000000000000000000000000000000001");
    store.createBet(user.id, {
      hash: "0xhash",
      choice: "Big",
      amount: 0.05,
      payout: 0.094,
      result: "win",
    });
    const res = await request(app).get("/api/leaderboard?period=alltime");
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("respects limit query param", async () => {
    for (let i = 0; i < 5; i++) {
      const user = store.createUser(`0x${i}000000000000000000000000000000000000${i}`);
      store.createBet(user.id, { hash: `0x${i}`, choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    }
    const res = await request(app).get("/api/leaderboard?period=alltime&limit=2");
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });
});
