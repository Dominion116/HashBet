require("../setup");
const express = require("express");
const cors = require("cors");

function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (_req, res) => {
    res.json({ success: true, service: "HashBet API", status: "running" });
  });

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      status: "ok",
      timestamp: new Date().toISOString(),
      storage: "runtime-fallback",
      databaseConnected: false,
    });
  });

  const routes = require("../../src/routes");
  app.use("/api", routes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
  });

  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  });

  return app;
}

module.exports = { buildApp };
