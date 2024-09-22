import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = (() => {
  const value = process.env.MONGODB_URL;

  if (value === undefined) {
    throw new Error("missing environment variable 'MONGODB_URL'");
  }

  return value;
})();

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  return cached.conn;
};
