import OpenAI from 'openai';
import { env } from '../config/env';

export function getOpenAIClient() {
  if (!env.openAiApiKey) return null;
  return new OpenAI({ apiKey: env.openAiApiKey });
}