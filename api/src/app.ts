import cors from 'cors';
import express from 'express';
import { corsOptions } from './config/cors';
import router from './routes';

export function createApp() {
  const app = express();
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(router);
  app.use((error: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error.message.startsWith('CORS origin not allowed:')) {
      return res.status(403).json({ error: 'CORS origin not allowed.' });
    }
    return next(error);
  });
  return app;
}

export const app = createApp();
