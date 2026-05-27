require("../setup");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { buildApp } = require("../helpers/appFactory");
const store = require("../../src/config/runtimeStore");

const app = buildApp();
const JWT_SECRET = process.env.JWT_SECRET;

function makeAuthHeader(userId, address) {
  const token = jwt.sign({ userId, address }, JWT_SECRET);
  return `Bearer ${token}`;
}

beforeEach(() => store.clearAll());
afterEach(() => store.clearAll());

describe("GET /api/bets", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/bets");
    expect(res.status).toBe(401);
  });

  it("returns 200 with a valid token", async () => {
    const user = store.createUser("0xbetplayer00000000000000000000000000001");
    const res = await request(app)
      .get("/api/bets")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.status).toBe(200);
  });

  it("returns success: true with valid token", async () => {
    const user = store.createUser("0xbetplayer00000000000000000000000000002");
    const res = await request(app)
      .get("/api/bets")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.body.success).toBe(true);
  });

  it("returns an array in data field", async () => {
    const user = store.createUser("0xbetplayer00000000000000000000000000003");
    const res = await request(app)
      .get("/api/bets")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("returns empty array when user has no bets", async () => {
    const user = store.createUser("0xnobets000000000000000000000000000000001");
    const res = await request(app)
      .get("/api/bets")
      .set("Authorization", makeAuthHeader(user.id, user.address));
    expect(res.body.data).toHaveLength(0);
  });
});

describe("POST /api/bets", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).post("/api/bets").send({});
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const user = store.createUser("0xpostbet0000000000000000000000000000001");
    const res = await request(app)
      .post("/api/bets")
      .set("Authorization", makeAuthHeader(user.id, user.address))
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
