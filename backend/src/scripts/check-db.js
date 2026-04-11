require("dotenv").config();
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

async function checkDatabaseAccess() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
    return;
  }

  const probeId = randomUUID();
  const probeDoc = {
    probeId,
    createdAt: new Date(),
    kind: "atlas-read-write-check",
  };

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: false,
    });

    const collection = mongoose.connection.db.collection("db_checks");

    await collection.insertOne(probeDoc);
    const found = await collection.findOne({ probeId });

    if (!found) {
      throw new Error("Write succeeded, but read-back failed");
    }

    await collection.deleteOne({ probeId });

    console.log("Database read/write check passed.");
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Collection: db_checks`);
    process.exit(0);
  } catch (err) {
    console.error(`Database read/write check failed: ${err.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

checkDatabaseAccess();
