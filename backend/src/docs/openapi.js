const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "HashBet API",
    version: "1.0.0",
    description: "API documentation for HashBet backend services.",
  },
  servers: [
    {
      url: "https://hashbet.onrender.com",
      description: "Production",
    },
    {
      url: "http://localhost:3001",
      description: "Local Development",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "User" },
    { name: "Bets" },
    { name: "Leaderboard" },
    { name: "Config" },
    { name: "Contract" },
    { name: "Health" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Invalid signature" },
        },
      },
      Bet: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          hash: { type: "string", example: "A1B2C3D4..." },
          choice: { type: "string", enum: ["Big", "Small"] },
          amount: { type: "string", example: "1.000" },
          payout: { type: "string", example: "1.880" },
          result: { type: "string", enum: ["win", "lose"] },
          blockNumber: { type: "integer", nullable: true, example: 28447201 },
          timestamp: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "API root",
        responses: {
          200: {
            description: "Service information",
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Healthy",
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Sign in with wallet",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["address", "signature", "message"],
                properties: {
                  address: { type: "string", example: "0x123..." },
                  signature: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Authenticated" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Sign out",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Logged out" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/stats": {
      get: {
        tags: ["User"],
        summary: "Get user stats",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Stats response" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/history": {
      get: {
        tags: ["User"],
        summary: "Get user history",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          200: {
            description: "History response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Bet" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/bets": {
      post: {
        tags: ["Bets"],
        summary: "Create bet record",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["hash", "choice", "amount", "payout", "result"],
                properties: {
                  hash: { type: "string" },
                  choice: { type: "string", enum: ["Big", "Small"] },
                  amount: { type: "number", example: 1 },
                  payout: { type: "number", example: 1.88 },
                  result: { type: "string", enum: ["win", "lose"] },
                  blockNumber: { type: "integer", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Created" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
        },
      },
      get: {
        tags: ["Bets"],
        summary: "Get authenticated user bets",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Bets response" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/bets/{id}": {
      get: {
        tags: ["Bets"],
        summary: "Get a bet by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Bet response" },
          401: { description: "Unauthorized" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/leaderboard": {
      get: {
        tags: ["Leaderboard"],
        summary: "Get leaderboard",
        parameters: [
          {
            name: "period",
            in: "query",
            schema: { type: "string", enum: ["day", "week", "month", "alltime"], default: "week" },
          },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
        ],
        responses: {
          200: { description: "Leaderboard response" },
          400: { description: "Bad request" },
        },
      },
    },
    "/api/config/public": {
      get: {
        tags: ["Config"],
        summary: "Get public chain and contract config",
        responses: {
          200: { description: "Public config response" },
        },
      },
    },
    "/api/contract/state": {
      get: {
        tags: ["Contract"],
        summary: "Get on-chain contract state",
        responses: {
          200: { description: "Contract state response" },
          400: { description: "Missing config" },
          500: { description: "RPC or contract call error" },
        },
      },
    },
  },
};

module.exports = openApiSpec;
