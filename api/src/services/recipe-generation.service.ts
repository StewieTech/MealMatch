import { randomUUID } from 'crypto';
import {
  GENERATE_RECIPES_SYSTEM_PROMPT,
  GenerateRecipesPromptFilters,
  buildGenerateRecipesUserPrompt,
} from '../prompts/generate-recipes';
import { getOpenAIClient } from './openai.service';

export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RecipeStep {
  number: number;
  instruction: string;
}

export interface RecipeDetail {
  id: string;
  title: string;
  matchPercent: number;
  timeMinutes: number;
  difficulty: RecipeDifficulty;
  cuisine: string;
  servings: number;
  missingIngredients: number;
  ingredients: string[];
  steps: RecipeStep[];
}

export interface RecipeFilter {
  quickMeal?: boolean;
  highProtein?: boolean;
  vegetarian?: boolean;
}

const DEFAULT_RECIPE_COUNT = 4;

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, Math.round(numeric)));
}

function normalizeDifficulty(value: unknown): RecipeDifficulty {
  if (value === 'Easy' || value === 'Medium' || value === 'Hard') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower.includes('easy')) return 'Easy';
    if (lower.includes('hard') || lower.includes('difficult')) return 'Hard';
  }
  return 'Medium';
}

function normalizeSteps(value: unknown): RecipeStep[] {
  if (!Array.isArray(value)) return [];
  const steps: RecipeStep[] = [];
  value.forEach((item, index) => {
    let instruction = '';
    if (typeof item === 'string') {
      instruction = item.trim();
    } else if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      const candidate = record.instruction ?? record.step ?? record.text;
      if (typeof candidate === 'string') instruction = candidate.trim();
    }
    if (instruction) {
      steps.push({ number: index + 1, instruction });
    }
  });
  return steps;
}

function normalizeIngredientLines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

function toRecipeDetail(raw: unknown, fallbackCuisine: string): RecipeDetail | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const steps = normalizeSteps(record.steps);
  const ingredients = normalizeIngredientLines(record.ingredients);
  if (!title || steps.length === 0 || ingredients.length === 0) return null;

  return {
    id: randomUUID(),
    title,
    matchPercent: clampNumber(record.matchPercent, 0, 100, 75),
    timeMinutes: clampNumber(record.timeMinutes, 1, 240, 30),
    difficulty: normalizeDifficulty(record.difficulty),
    cuisine:
      typeof record.cuisine === 'string' && record.cuisine.trim().length > 0
        ? record.cuisine.trim()
        : fallbackCuisine,
    servings: clampNumber(record.servings, 1, 12, 2),
    missingIngredients: clampNumber(record.missingIngredients, 0, 20, 0),
    ingredients,
    steps,
  };
}

function buildFallbackRecipes(ingredients: string[], filters: RecipeFilter): RecipeDetail[] {
  const primary = ingredients[0] || 'pantry staples';
  const vegetarian = Boolean(filters.vegetarian);
  const quick = Boolean(filters.quickMeal);
  const baseTime = quick ? 15 : 30;

  const templates: Array<Omit<RecipeDetail, 'id'>> = [
    {
      title: `${primary.replace(/(^\w)/, (m) => m.toUpperCase())} Skillet Bowl`,
      matchPercent: 100,
      timeMinutes: baseTime,
      difficulty: 'Easy',
      cuisine: 'Comfort',
      servings: 2,
      missingIngredients: 0,
      ingredients: ingredients.map((item, index) => `${index + 1} portion ${item}`),
      steps: [
        { number: 1, instruction: 'Prep the ingredients and heat a skillet over medium-high heat.' },
        { number: 2, instruction: 'Cook the main ingredients until tender and flavorful.' },
        { number: 3, instruction: 'Season to taste with salt and pepper, then serve warm.' },
      ],
    },
    {
      title: `${vegetarian ? 'Garden' : 'Savory'} ${primary.replace(/(^\w)/, (m) => m.toUpperCase())} Stir-Fry`,
      matchPercent: 90,
      timeMinutes: baseTime + 5,
      difficulty: 'Easy',
      cuisine: 'Asian',
      servings: 2,
      missingIngredients: 1,
      ingredients: [...ingredients.map((i) => `1 portion ${i}`), '1 tbsp soy sauce'],
      steps: [
        { number: 1, instruction: 'Heat oil in a wok or large pan over high heat.' },
        { number: 2, instruction: 'Stir-fry the ingredients for 5-6 minutes until cooked through.' },
        { number: 3, instruction: 'Add soy sauce, toss, and serve immediately.' },
      ],
    },
    {
      title: `Rustic ${primary.replace(/(^\w)/, (m) => m.toUpperCase())} Bake`,
      matchPercent: 80,
      timeMinutes: baseTime + 15,
      difficulty: 'Medium',
      cuisine: 'Mediterranean',
      servings: 3,
      missingIngredients: 2,
      ingredients: [...ingredients.map((i) => `1 portion ${i}`), 'olive oil', 'mixed herbs'],
      steps: [
        { number: 1, instruction: 'Preheat the oven to 200C (400F).' },
        { number: 2, instruction: 'Toss the ingredients with olive oil and herbs on a sheet pan.' },
        { number: 3, instruction: 'Roast for 20-25 minutes until golden and tender.' },
      ],
    },
    {
      title: `${primary.replace(/(^\w)/, (m) => m.toUpperCase())} Rice Bowl`,
      matchPercent: 75,
      timeMinutes: baseTime + 10,
      difficulty: 'Easy',
      cuisine: 'Fusion',
      servings: 2,
      missingIngredients: 2,
      ingredients: [...ingredients.map((i) => `1 portion ${i}`), '1 cup cooked rice', 'sesame oil'],
      steps: [
        { number: 1, instruction: 'Cook rice according to package instructions.' },
        { number: 2, instruction: 'Saute the remaining ingredients with sesame oil for 6-8 minutes.' },
        { number: 3, instruction: 'Spoon the mixture over rice and serve.' },
      ],
    },
  ];

  return templates.map((template) => ({ ...template, id: randomUUID() }));
}

export async function generateRecipes(
  ingredients: string[],
  filters: RecipeFilter = {}
): Promise<{ recipes: RecipeDetail[]; usedFallback: boolean }> {
  if (ingredients.length === 0) {
    return { recipes: [], usedFallback: false };
  }

  const client = getOpenAIClient();
  if (!client) {
    return { recipes: buildFallbackRecipes(ingredients, filters), usedFallback: true };
  }

  try {
    const promptFilters: GenerateRecipesPromptFilters = {
      quickMeal: filters.quickMeal,
      highProtein: filters.highProtein,
      vegetarian: filters.vegetarian,
    };

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: GENERATE_RECIPES_SYSTEM_PROMPT },
        { role: 'user', content: buildGenerateRecipesUserPrompt(ingredients, promptFilters) },
      ],
    });

    const raw = response.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(raw) as { recipes?: unknown };
    if (!parsed || !Array.isArray(parsed.recipes)) {
      return { recipes: buildFallbackRecipes(ingredients, filters), usedFallback: true };
    }

    const normalized = parsed.recipes
      .map((item) => toRecipeDetail(item, 'Fusion'))
      .filter((recipe): recipe is RecipeDetail => recipe !== null)
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, DEFAULT_RECIPE_COUNT);

    if (normalized.length === 0) {
      return { recipes: buildFallbackRecipes(ingredients, filters), usedFallback: true };
    }

    return { recipes: normalized, usedFallback: false };
  } catch {
    return { recipes: buildFallbackRecipes(ingredients, filters), usedFallback: true };
  }
}
