import {
  GenerateRecipesResponse,
  RecipeFilter,
  TranscriptionResponse,
} from '../types/voice';
import { API_BASE } from './api';

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data && typeof data.error === 'string') message = data.error;
    } catch {
      // ignore json parse errors
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string
): Promise<TranscriptionResponse> {
  return postJson<TranscriptionResponse>('/voice/transcribe', {
    audioBase64,
    mimeType,
  });
}

export async function generateRecipes(
  ingredients: string[],
  filters: RecipeFilter
): Promise<GenerateRecipesResponse> {
  return postJson<GenerateRecipesResponse>('/recipes/generate', {
    ingredients,
    filters,
  });
}
