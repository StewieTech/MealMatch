import {
  buildVoiceRecipeRequestSignature,
  getRecipesFromCacheOrFetch,
} from '../app/providers/VoiceResultsCacheProvider';
import { RecipeDetail } from '../app/types/voice';

function createRecipe(id: string): RecipeDetail {
  return {
    id,
    title: `Recipe ${id}`,
    matchPercent: 90,
    timeMinutes: 20,
    difficulty: 'Easy',
    cuisine: 'Fusion',
    servings: 2,
    missingIngredients: 0,
    ingredients: ['chicken', 'rice'],
    steps: [{ number: 1, instruction: 'Cook everything.' }],
  };
}

describe('voice results cache', () => {
  it('builds the same cache key for equivalent ingredients and default filters', () => {
    const a = buildVoiceRecipeRequestSignature(
      [' Chicken ', 'rice', 'RICE'],
      { quickMeal: false }
    );
    const b = buildVoiceRecipeRequestSignature(
      ['chicken', 'rice'],
      { quickMeal: false, highProtein: false, vegetarian: false }
    );

    expect(a.ingredients).toEqual(['chicken', 'rice']);
    expect(a.cacheKey).toBe(b.cacheKey);
  });

  it('fetches once and serves unchanged requests from cache', async () => {
    const signature = buildVoiceRecipeRequestSignature(
      ['chicken', 'rice'],
      { quickMeal: true, vegetarian: false, highProtein: false }
    );
    const cache = new Map<string, RecipeDetail[]>();
    const fetcher = jest.fn(async () => [createRecipe('a')]);

    const first = await getRecipesFromCacheOrFetch(cache, signature, fetcher);
    const second = await getRecipesFromCacheOrFetch(cache, signature, fetcher);

    expect(first.fromCache).toBe(false);
    expect(second.fromCache).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(second.recipes).toEqual(first.recipes);
  });

  it('misses cache when filters change', async () => {
    const base = buildVoiceRecipeRequestSignature(['chicken', 'rice'], { quickMeal: false });
    const changed = buildVoiceRecipeRequestSignature(['chicken', 'rice'], { quickMeal: true });
    const cache = new Map<string, RecipeDetail[]>();
    const fetcher = jest.fn(async () => [createRecipe('x')]);

    await getRecipesFromCacheOrFetch(cache, base, fetcher);
    await getRecipesFromCacheOrFetch(cache, changed, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(base.cacheKey).not.toBe(changed.cacheKey);
  });
});

