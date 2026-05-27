require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("GET /api/contract/state", () => {
  it("returns 200 status", async () => {
    const res = await request(app).get("/api/contract/state");
    expect(res.status).toBe(200);
  });

  it("returns JSON content-type", async () => {
    const res = await request(app).get("/api/contract/state");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("returns success field in response", async () => {
    const res = await request(app).get("/api/contract/state");
    expect(res.body).toHaveProperty("success");
  });

  it("does not require authentication", async () => {
    const res = await request(app).get("/api/contract/state");
    expect(res.status).not.toBe(401);
  });

  it("returns data object when successful", async () => {
    const res = await request(app).get("/api/contract/state");
    if (res.body.success) {
      expect(res.body).toHaveProperty("data");
    }
  });
});
