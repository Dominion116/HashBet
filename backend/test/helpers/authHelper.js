const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-unit-testing-only";

function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, options);
}

function makeUserToken(userId, address, options = {}) {
  return signToken({ userId, address }, options);
}

function makeBearerHeader(userId, address, options = {}) {
  return `Bearer ${makeUserToken(userId, address, options)}`;
}

function makeExpiredToken(userId, address) {
  return makeUserToken(userId, address, { expiresIn: -1 });
}

module.exports = {
  signToken,
  makeUserToken,
  makeBearerHeader,
  makeExpiredToken,
};
