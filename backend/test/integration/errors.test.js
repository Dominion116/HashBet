require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("Error handling", () => {
  describe("404 Not Found", () => {
    it("returns 404 for GET to unknown path", async () => {
      const res = await request(app).get("/api/does-not-exist");
      expect(res.status).toBe(404);
    });

    it("returns 404 for POST to unknown path", async () => {
      const res = await request(app).post("/api/unknown-endpoint");
      expect(res.status).toBe(404);
    });

    it("returns success: false on 404", async () => {
      const res = await request(app).get("/api/totally-fake");
      expect(res.body.success).toBe(false);
    });

    it("returns error field on 404", async () => {
      const res = await request(app).get("/api/totally-fake");
      expect(res.body).toHaveProperty("error");
      expect(typeof res.body.error).toBe("string");
    });

    it("returns JSON content-type on 404", async () => {
      const res = await request(app).get("/xyz/abc");
      expect(res.headers["content-type"]).toMatch(/application\/json/);
    });
  });

  describe("Protected routes without auth", () => {
    it("GET /api/bets returns 401 without token", async () => {
      const res = await request(app).get("/api/bets");
      expect(res.status).toBe(401);
    });

    it("POST /api/bets returns 401 without token", async () => {
      const res = await request(app).post("/api/bets").send({});
      expect(res.status).toBe(401);
    });

    it("GET /api/user/stats returns 401 without token", async () => {
      const res = await request(app).get("/api/user/stats");
      expect(res.status).toBe(401);
    });

    it("GET /api/user/history returns 401 without token", async () => {
      const res = await request(app).get("/api/user/history");
      expect(res.status).toBe(401);
    });

    it("returns success: false on 401", async () => {
      const res = await request(app).get("/api/bets");
      expect(res.body.success).toBe(false);
    });
  });
});
