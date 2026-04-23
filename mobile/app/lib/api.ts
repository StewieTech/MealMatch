import { RecipeResponse } from '../types/recipe';

const DEFAULT_LOCAL_API_BASE = 'http://localhost:4001';
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_LOCAL_API_BASE;

const apiBaseLogState = globalThis as typeof globalThis & {
  __mealmatchApiBaseLogged?: boolean;
};

if (!apiBaseLogState.__mealmatchApiBaseLogged) {
  console.log(`[MealMatch] API base URL: ${API_BASE}`);
  apiBaseLogState.__mealmatchApiBaseLogged = true;
}

export async function fetchRecipeFromText(ingredientsText: string): Promise<RecipeResponse> {
  const response = await fetch(`${API_BASE}/recipes/from-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredientsText }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate recipe.');
  }

  return response.json();
}