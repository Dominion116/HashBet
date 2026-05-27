require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("GET /", () => {
  it("returns 200 status", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });

  it("returns success: true", async () => {
    const res = await request(app).get("/");
    expect(res.body.success).toBe(true);
  });

  it("returns service name as HashBet API", async () => {
    const res = await request(app).get("/");
    expect(res.body.service).toBe("HashBet API");
  });

  it("returns status: running", async () => {
    const res = await request(app).get("/");
    expect(res.body.status).toBe("running");
  });

  it("responds with JSON content-type", async () => {
    const res = await request(app).get("/");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});

describe("GET /nonexistent-route", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/nonexistent-route");
    expect(res.status).toBe(404);
  });

  it("returns success: false on 404", async () => {
    const res = await request(app).get("/nonexistent-route");
    expect(res.body.success).toBe(false);
  });

  it("returns a descriptive error message on 404", async () => {
    const res = await request(app).get("/this-does-not-exist");
    expect(res.body.error).toBe("Route not found");
  });
});
