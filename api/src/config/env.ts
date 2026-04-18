import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4001),
  awsRegion: process.env.AWS_REGION || 'ca-central-1',
  uploadsBucket: process.env.UPLOADS_BUCKET || 'mealmatch-uploads-dev',
  mongoUri: process.env.MONGODB_URI || '',
  mongoDb: process.env.MONGODB_DB || 'mealmatch_dev',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
};