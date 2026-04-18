import mongoose from 'mongoose';
import { env } from '../config/env';

let connectPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase() {
  if (!env.mongoUri) return null;
  if (!connectPromise) {
    connectPromise = mongoose.connect(env.mongoUri, {
      dbName: env.mongoDb,
    });
  }
  return connectPromise;
}