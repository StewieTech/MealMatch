import { app } from './app';
import { env } from './config/env';
import { connectToDatabase } from './lib/mongo';

async function bootstrap() {
  await connectToDatabase();
  app.listen(env.port, () => {
    console.log(`MealMatch API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start MealMatch API', error);
  process.exit(1);
});