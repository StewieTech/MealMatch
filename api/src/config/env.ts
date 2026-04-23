import path from 'path';
import dotenv from 'dotenv';

// Load local api/.env first so it wins on conflicts, then fall back to the
// monorepo root .env. dotenv does not overwrite already-set variables.
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  port: Number(process.env.PORT || 4001),
  awsRegion: process.env.AWS_REGION || 'ca-central-1',
  uploadsBucket: process.env.UPLOADS_BUCKET || 'mealmatch-uploads-dev',
  mongoUri: process.env.MONGODB_URI || '',
  mongoDb: process.env.MONGODB_DB || 'mealmatch_dev',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
};