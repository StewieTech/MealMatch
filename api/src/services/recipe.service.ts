import { getOpenAIClient } from './openai.service';

export type RecipePayload = {
  title: string;
  servings: number;
  timeMinutes: number;
  ingredients: string[];
  steps: string[];
};

function buildFallbackRecipe(ingredients: string[]): RecipePayload {
  const primary = ingredients[0] || 'fridge staples';
  return {
    title: `${primary.replace(/(^\w)/, (match) => match.toUpperCase())} Skillet Bowl`,
    servings: 2,
    timeMinutes: 25,
    ingredients: ingredients.map((item, index) => `${index + 1} portion ${item}`),
    steps: [
      'Prep the ingredients and heat a skillet.',
      'Cook the main ingredients until tender and flavorful.',
      'Season to taste and serve warm.',
    ],
  };
}

function parseRecipeJson(raw: string, fallback: RecipePayload) {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.title === 'string' && Array.isArray(parsed?.ingredients) && Array.isArray(parsed?.steps)) {
      return {
        title: parsed.title,
        servings: Number(parsed.servings || fallback.servings),
        timeMinutes: Number(parsed.timeMinutes || fallback.timeMinutes),
        ingredients: parsed.ingredients,
        steps: parsed.steps,
      } satisfies RecipePayload;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

export async function generateRecipe(ingredients: string[]) {
  const fallback = buildFallbackRecipe(ingredients);
  const client = getOpenAIClient();
  if (!client) return fallback;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are MealMatch, a recipe assistant. Return valid JSON only with keys: title, servings, timeMinutes, ingredients, steps.',
        },
        {
          role: 'user',
          content: `Create a simple recipe using these ingredients: ${ingredients.join(', ')}`,
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content || '';
    return parseRecipeJson(raw, fallback);
  } catch {
    return fallback;
  }
}