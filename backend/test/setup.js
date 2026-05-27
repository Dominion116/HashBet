process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-for-unit-testing-only";
process.env.PORT = "3099";
process.env.MONGODB_URI = "";

jest.setTimeout(15000);
