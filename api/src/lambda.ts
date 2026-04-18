import serverless from 'serverless-http';
import { app } from './app';
import { connectToDatabase } from './lib/mongo';

const proxy = serverless(app);

export const handler = async (event: unknown, context: unknown) => {
  await connectToDatabase();
  return proxy(event as never, context as never);
};