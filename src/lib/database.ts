import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = (() => {
  const value = process.env.MONGODB_URL;

  if (value === undefined) {
    throw new Error("environment variable 'MONGODB_URL' should be defined");
  }

  return value;
})();

let cachedConnection: Mongoose | null = null;

/**
 * Opens a connection to the database and caches it. It is safe to call this
 * function multiple times, so use it before doing any database operations.
 */
export async function connectToDatabase() {
  if (cachedConnection !== null) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(MONGODB_URL, {
    bufferCommands: false,
    autoCreate: false,
  });

  cachedConnection = connection;
  console.log("new connection to MongoDB established");
  return connection;
}

mongoose.connection.on("close", () => {
  cachedConnection = null;
  console.warn("MongoDB connection closed");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
