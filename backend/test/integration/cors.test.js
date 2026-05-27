require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("CORS headers", () => {
  it("responds to OPTIONS preflight without crashing", async () => {
    const res = await request(app)
      .options("/api/config/public")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "GET");
    expect([200, 204]).toContain(res.status);
  });

  it("includes Access-Control-Allow-Origin on GET response", async () => {
    const res = await request(app)
      .get("/api/config/public")
      .set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });

  it("responds to requests from localhost:3000", async () => {
    const res = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:3000");
    expect(res.status).toBe(200);
  });

  it("includes CORS header on health endpoint", async () => {
    const res = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });
});
