require("../setup");
const request = require("supertest");
const { buildApp } = require("../helpers/appFactory");

const app = buildApp();

const PROTECTED_ROUTES = [
  { method: "get", path: "/api/bets" },
  { method: "post", path: "/api/bets" },
  { method: "get", path: "/api/user/stats" },
  { method: "get", path: "/api/user/history" },
  { method: "post", path: "/api/auth/logout" },
];

const PUBLIC_ROUTES = [
  { method: "get", path: "/health" },
  { method: "get", path: "/" },
  { method: "get", path: "/api/leaderboard" },
  { method: "get", path: "/api/config/public" },
  { method: "get", path: "/api/contract/state" },
];

describe("Auth guard – protected routes reject unauthenticated requests", () => {
  for (const { method, path } of PROTECTED_ROUTES) {
    it(`${method.toUpperCase()} ${path} returns 401 without token`, async () => {
      const res = await request(app)[method](path).send({});
      expect(res.status).toBe(401);
    });
  }
});

describe("Auth guard – public routes are accessible without token", () => {
  for (const { method, path } of PUBLIC_ROUTES) {
    it(`${method.toUpperCase()} ${path} does not return 401`, async () => {
      const res = await request(app)[method](path);
      expect(res.status).not.toBe(401);
    });
  }
});
