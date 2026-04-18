require("dotenv").config();
const { connectDatabase, isMongoConnected, mongoose } = require("../config/database");
const runtimeStore = require("../config/runtimeStore");
const Bet = require("../models/Bet");
const User = require("../models/User");

const CONFIRM_FLAG = "YES_RESET_HASHBET";

async function resetDatabase() {
  try {
    if (process.env.RESET_DB_CONFIRM !== CONFIRM_FLAG) {
      console.error(`Refusing to reset. Set RESET_DB_CONFIRM=${CONFIRM_FLAG} to continue.`);
      process.exit(1);
      return;
    }

    await connectDatabase();

    if (isMongoConnected()) {
      await Promise.all([
        Bet.Model.deleteMany({}),
        User.Model.deleteMany({}),
      ]);
      console.log("MongoDB reset complete: users and bets cleared.");
    } else {
      console.log("MongoDB unavailable: skipping persistent reset.");
    }

    runtimeStore.clearAll();
    console.log("Runtime store reset complete.");

    process.exit(0);
  } catch (err) {
    console.error("Database reset failed:", err.message || err);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

resetDatabase();
