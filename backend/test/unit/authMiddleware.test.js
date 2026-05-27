require("../setup");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../../src/middleware/auth");

function mockReq(token) {
  return {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  const secret = "test-jwt-secret-for-unit-testing-only";
  const payload = { userId: "user123", address: "0xabc" };

  it("calls next() with a valid token", () => {
    const token = jwt.sign(payload, secret);
    const req = mockReq(token);
    const res = mockRes();
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("attaches decoded payload to req.user", () => {
    const token = jwt.sign(payload, secret);
    const req = mockReq(token);
    const res = mockRes();
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(req.user.userId).toBe(payload.userId);
    expect(req.user.address).toBe(payload.address);
  });

  it("returns 401 when no token is provided", () => {
    const req = mockReq(null);
    const res = mockRes();
    authMiddleware(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: "No token provided" })
    );
  });

  it("returns 401 for a token signed with the wrong secret", () => {
    const token = jwt.sign(payload, "wrong-secret");
    const req = mockReq(token);
    const res = mockRes();
    authMiddleware(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: "Invalid token" })
    );
  });

  it("returns 401 for a malformed token string", () => {
    const req = mockReq("not.a.valid.jwt");
    const res = mockRes();
    authMiddleware(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 for an expired token", () => {
    const token = jwt.sign(payload, secret, { expiresIn: -1 });
    const req = mockReq(token);
    const res = mockRes();
    authMiddleware(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("does not call next() when token is invalid", () => {
    const req = mockReq("bad-token");
    const res = mockRes();
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
