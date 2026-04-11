require("dotenv").config();
const mongoose = require("mongoose");

let hasMongoConnection = false;

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    hasMongoConnection = false;
    console.warn("MONGODB_URI is not set; using in-memory fallback.");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true,
    });
    hasMongoConnection = true;
    console.log("MongoDB connected");
  } catch (err) {
    hasMongoConnection = false;
    console.warn(`MongoDB unavailable, using in-memory fallback: ${err.message}`);
  }
}

function isMongoConnected() {
  return hasMongoConnection && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDatabase,
  isMongoConnected,
  mongoose,
};
