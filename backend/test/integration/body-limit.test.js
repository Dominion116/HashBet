require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

describe("Request body size limit", () => {
  it("accepts a request body under 1mb", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ address: "0x123", signature: "0xsig", message: "hello" });
    expect(res.status).not.toBe(413);
  });

  it("rejects a request body over 1mb with 413", async () => {
    const bigPayload = { data: "x".repeat(1_100_000) };
    const res = await request(app).post("/api/auth/login").send(bigPayload);
    expect(res.status).toBe(413);
  });
});
