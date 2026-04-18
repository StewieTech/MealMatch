import { RecipeResponse } from '../types/recipe';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4001';

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