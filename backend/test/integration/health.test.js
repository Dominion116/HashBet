require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("GET /health", () => {
  it("returns 200 status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  it("returns success: true", async () => {
    const res = await request(app).get("/health");
    expect(res.body.success).toBe(true);
  });

  it("returns status: ok", async () => {
    const res = await request(app).get("/health");
    expect(res.body.status).toBe("ok");
  });

  it("returns a valid ISO timestamp", async () => {
    const res = await request(app).get("/health");
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });

  it("includes databaseConnected field", async () => {
    const res = await request(app).get("/health");
    expect(res.body).toHaveProperty("databaseConnected");
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});
