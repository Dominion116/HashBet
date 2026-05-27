require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("GET /api/config/public", () => {
  it("returns 200 status", async () => {
    const res = await request(app).get("/api/config/public");
    expect(res.status).toBe(200);
  });

  it("returns success: true", async () => {
    const res = await request(app).get("/api/config/public");
    expect(res.body.success).toBe(true);
  });

  it("returns data object with chainId", async () => {
    const res = await request(app).get("/api/config/public");
    expect(res.body.data).toHaveProperty("chainId");
    expect(typeof res.body.data.chainId).toBe("number");
  });

  it("returns data object with paymentTokenSymbol", async () => {
    const res = await request(app).get("/api/config/public");
    expect(res.body.data).toHaveProperty("paymentTokenSymbol");
    expect(typeof res.body.data.paymentTokenSymbol).toBe("string");
  });

  it("returns data object with paymentTokenDecimals", async () => {
    const res = await request(app).get("/api/config/public");
    expect(res.body.data).toHaveProperty("paymentTokenDecimals");
    expect(typeof res.body.data.paymentTokenDecimals).toBe("number");
  });

  it("contractAddress is null when env var is unset", async () => {
    const original = process.env.CONTRACT_ADDRESS;
    delete process.env.CONTRACT_ADDRESS;
    const res = await request(app).get("/api/config/public");
    expect(res.body.data.contractAddress).toBeNull();
    if (original) process.env.CONTRACT_ADDRESS = original;
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/api/config/public");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("does not require authentication", async () => {
    const res = await request(app).get("/api/config/public");
    expect(res.status).not.toBe(401);
  });
});
