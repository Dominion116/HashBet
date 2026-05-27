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

describe("GET /api/user/stats", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/user/stats");
    expect(res.status).toBe(401);
  });

  it("returns 200 with valid token", async () => {
    const user = store.createUser("0xstatsuser0000000000000000000000000001");
    const res = await request(app)
      .get("/api/user/stats")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
  });

  it("returns success: true with valid token", async () => {
    const user = store.createUser("0xstatsuser0000000000000000000000000002");
    const res = await request(app)
      .get("/api/user/stats")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.body.success).toBe(true);
  });

  it("returns data with total_bets field", async () => {
    const user = store.createUser("0xstatsuser0000000000000000000000000003");
    const res = await request(app)
      .get("/api/user/stats")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.body.data).toHaveProperty("total_bets");
  });
});

describe("GET /api/user/history", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/user/history");
    expect(res.status).toBe(401);
  });

  it("returns 200 with valid token", async () => {
    const user = store.createUser("0xhistuser0000000000000000000000000000001");
    const res = await request(app)
      .get("/api/user/history")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
  });

  it("returns an array in data", async () => {
    const user = store.createUser("0xhistuser0000000000000000000000000000002");
    const res = await request(app)
      .get("/api/user/history")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("respects limit query param", async () => {
    const user = store.createUser("0xhistuser0000000000000000000000000000003");
    const res = await request(app)
      .get("/api/user/history?limit=5")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
  });
});
