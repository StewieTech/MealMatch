import cors from 'cors';
import express from 'express';
import router from './routes';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(router);
  return app;
}

export const app = createApp();