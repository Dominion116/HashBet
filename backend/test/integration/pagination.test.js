require("../setup");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { buildApp } = require("../helpers/appFactory");
const store = require("../../src/config/runtimeStore");

const app = buildApp();
const JWT_SECRET = process.env.JWT_SECRET;

function makeAuthHeader(userId, address) {
  return `Bearer ${jwt.sign({ userId, address }, JWT_SECRET)}`;
}

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("Pagination – /api/user/history", () => {
  it("respects limit=3 and returns at most 3 items", async () => {
    const user = store.createUser("0xpagination0000000000000000000000001");
    const Bet = require("../../src/models/Bet");
    for (let i = 0; i < 10; i++) {
      await Bet.create(user.id, {
        hash: `0x${i}`,
        choice: "Big",
        amount: 0.05,
        payout: 0.094,
        result: "win",
      });
    }
    const res = await request(app)
      .get("/api/user/history?limit=3")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
  });

  it("returns empty data array when offset exceeds total bets", async () => {
    const user = store.createUser("0xpagination0000000000000000000000002");
    const res = await request(app)
      .get("/api/user/history?limit=10&offset=100")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe("Pagination – /api/bets", () => {
  it("accepts limit query param", async () => {
    const user = store.createUser("0xpagination0000000000000000000000003");
    const res = await request(app)
      .get("/api/bets?limit=5")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
  });

  it("accepts offset query param", async () => {
    const user = store.createUser("0xpagination0000000000000000000000004");
    const res = await request(app)
      .get("/api/bets?offset=0")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
  });
});
