require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const routes = require("./routes");
const openApiSpec = require("./docs/openapi");
const { connectDatabase } = require("./config/database");

const app = express();

const defaultAllowedOrigins = ["https://hashbetcelo.vercel.app", "http://localhost:3000"];
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : defaultAllowedOrigins;

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "HashBet API",
    status: "running",
  });
});

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/docs.json", (req, res) => {
  res.json(openApiSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`HashBet API running on http://localhost:${PORT}`);
  });
}

startServer();
