import mongoose from 'mongoose';

// Do NOT throw at import time — that crashes every /api route on Vercel
// with a cryptic error when the env var is missing. Throw lazily in dbConnect()
// so the API can return a clear JSON error instead.

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error(
      'MONGO_URI is not set. Add it to .env.local locally or Vercel Project Settings → Environment Variables.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((err) => {
        // Reset promise so a later request can retry instead of hanging on a rejected promise
        cached.promise = null;
        console.error('MongoDB connection failed:', err?.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

export default dbConnect;
