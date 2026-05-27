require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");
const jwt = require("jsonwebtoken");

const app = buildApp();
const JWT_SECRET = process.env.JWT_SECRET;

describe("POST /api/auth/login", () => {
  it("returns 400 when body is empty", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when address is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ signature: "0xsig", message: "msg" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when signature is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ address: "0xabc", message: "msg" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ address: "0xabc", signature: "0xsig" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid signature format", async () => {
    const res = await request(app).post("/api/auth/login").send({
      address: "0x1234567890123456789012345678901234567890",
      signature: "not-a-valid-signature",
      message: "Sign in to HashBet",
    });
    expect(res.status).toBe(400);
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});

describe("POST /api/auth/logout", () => {
  function makeToken(payload = { userId: "u1", address: "0xabc" }) {
    return jwt.sign(payload, JWT_SECRET);
  }

  it("returns 401 without a token", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(401);
  });

  it("returns success with a valid token", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${makeToken()}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
