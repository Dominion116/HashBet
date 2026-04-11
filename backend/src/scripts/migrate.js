require("dotenv").config();
const { connectDatabase, mongoose, isMongoConnected } = require("../config/database");
require("../models/User");
require("../models/Bet");

async function runMigrations() {
  try {
    console.log("Preparing MongoDB indexes...");
    await connectDatabase();

    if (!isMongoConnected()) {
      console.log("MongoDB not connected; skipped index sync.");
      process.exit(0);
      return;
    }

    await mongoose.connection.syncIndexes();
    console.log("✓ MongoDB indexes synced successfully");
    process.exit(0);
  } catch (err) {
    console.error("✗ MongoDB setup failed:", err.message);
    process.exit(1);
  }
}

runMigrations();
