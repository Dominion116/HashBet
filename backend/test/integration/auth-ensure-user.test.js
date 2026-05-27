require("../setup");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();
const JWT_SECRET = process.env.JWT_SECRET;

describe("POST /api/auth/ensure-user", () => {
  function makeToken(payload) {
    return jwt.sign(payload, JWT_SECRET);
  }

  it("returns 401 without a token", async () => {
    const res = await request(app).post("/api/auth/ensure-user");
    expect(res.status).toBe(401);
  });

  it("returns JSON content-type", async () => {
    const token = makeToken({ userId: "u1", address: "0xtest" });
    const res = await request(app)
      .post("/api/auth/ensure-user")
      .set("Authorization", `Bearer ${token}`);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("responds (success or error) with a valid token", async () => {
    const token = makeToken({ userId: "u1", address: "0xtest00000000000000000000000000001" });
    const res = await request(app)
      .post("/api/auth/ensure-user")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty("success");
  });
});
