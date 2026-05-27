require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("GET /api/debug/db-status", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/api/debug/db-status");
    expect(res.status).toBe(200);
  });

  it("returns mongoConnected field", async () => {
    const res = await request(app).get("/api/debug/db-status");
    expect(res.body).toHaveProperty("mongoConnected");
    expect(typeof res.body.mongoConnected).toBe("boolean");
  });

  it("returns timestamp field", async () => {
    const res = await request(app).get("/api/debug/db-status");
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("GET /api/debug/runtime-store", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/api/debug/runtime-store");
    expect(res.status).toBe(200);
  });

  it("returns runtimeUsers count", async () => {
    const res = await request(app).get("/api/debug/runtime-store");
    expect(res.body).toHaveProperty("runtimeUsers");
    expect(typeof res.body.runtimeUsers).toBe("number");
  });

  it("returns runtimeBets count", async () => {
    const res = await request(app).get("/api/debug/runtime-store");
    expect(res.body).toHaveProperty("runtimeBets");
  });
});
