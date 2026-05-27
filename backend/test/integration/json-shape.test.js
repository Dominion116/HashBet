require("../setup");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { buildApp } = require("../helpers/appFactory");
const store = require("../../src/config/runtimeStore");

const app = buildApp();
const JWT_SECRET = process.env.JWT_SECRET;

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("Response JSON shape consistency", () => {
  it("all successful responses have success: true at root", async () => {
    const routes = ["/health", "/", "/api/config/public", "/api/leaderboard"];
    for (const route of routes) {
      const res = await request(app).get(route);
      expect(res.body.success).toBe(true);
    }
  });

  it("all 401 error responses have success: false and error field", async () => {
    const protected_ = ["/api/bets", "/api/user/stats"];
    for (const route of protected_) {
      const res = await request(app).get(route);
      expect(res.body.success).toBe(false);
      expect(typeof res.body.error).toBe("string");
    }
  });

  it("/api/leaderboard data array entries have expected fields", async () => {
    const user = store.createUser("0xshapetest000000000000000000000000001");
    store.createBet(user.id, { hash: "0xh1", choice: "Big", amount: 0.05, payout: 0.094, result: "win" });
    const res = await request(app).get("/api/leaderboard?period=alltime");
    if (res.body.data.length > 0) {
      const entry = res.body.data[0];
      expect(entry).toHaveProperty("address");
      expect(entry).toHaveProperty("total_bets");
      expect(entry).toHaveProperty("wins");
      expect(entry).toHaveProperty("win_rate");
    }
  });

  it("/api/user/history with valid token returns data array", async () => {
    const user = store.createUser("0xshapetest000000000000000000000000002");
    const token = jwt.sign({ userId: user.id, address: user.address }, JWT_SECRET);
    const res = await request(app)
      .get("/api/user/history")
      .set("Authorization", `Bearer ${token}`);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
