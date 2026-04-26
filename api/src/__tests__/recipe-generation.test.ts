import request from 'supertest';
import { app } from '../app';
import { buildGenerateRecipesUserPrompt } from '../prompts/generate-recipes';
import { generateRecipes } from '../services/recipe-generation.service';

describe('generateRecipes service', () => {
  it('returns no recipes when ingredients list is empty', async () => {
    const result = await generateRecipes([]);
    expect(result.recipes).toEqual([]);
  });

  it('returns fallback recipes when no OpenAI client is configured', async () => {
    const result = await generateRecipes(['chicken', 'rice', 'broccoli']);
    expect(result.recipes.length).toBeGreaterThan(0);
    result.recipes.forEach((recipe) => {
      expect(recipe.id).toBeTruthy();
      expect(recipe.title).toBeTruthy();
      expect(recipe.matchPercent).toBeGreaterThanOrEqual(0);
      expect(recipe.matchPercent).toBeLessThanOrEqual(100);
      expect(Array.isArray(recipe.ingredients)).toBe(true);
      expect(Array.isArray(recipe.steps)).toBe(true);
      expect(recipe.steps[0]).toHaveProperty('number');
      expect(recipe.steps[0]).toHaveProperty('instruction');
    });
  });

  it('sorts recipes by matchPercent descending', async () => {
    const { recipes } = await generateRecipes(['tomato', 'garlic']);
    for (let i = 1; i < recipes.length; i++) {
      expect(recipes[i - 1].matchPercent).toBeGreaterThanOrEqual(recipes[i].matchPercent);
    }
  });
});

describe('POST /recipes/generate', () => {
  it('returns 400 when ingredients array is empty', async () => {
    const response = await request(app)
      .post('/recipes/generate')
      .send({ ingredients: [] });

    expect(response.status).toBe(400);
  });

  it('returns recipes array with match scores', async () => {
    const response = await request(app)
      .post('/recipes/generate')
      .send({
        ingredients: ['chicken breast', 'bell peppers', 'rice'],
        filters: { quickMeal: true },
      });

    expect(response.status).toBe(200);
    expect(typeof response.body.count).toBe('number');
    expect(Array.isArray(response.body.recipes)).toBe(true);
    expect(response.body.recipes.length).toBeGreaterThan(0);
    expect(response.body.recipes[0].title).toBeTruthy();
    expect(response.body.recipes[0].matchPercent).toBeDefined();
  });
});

describe('buildGenerateRecipesUserPrompt', () => {
  it('includes asian and mediterranean filter lines when enabled', () => {
    const prompt = buildGenerateRecipesUserPrompt(['chickpeas', 'tomatoes'], {
      asian: true,
      mediterranean: true,
    });

    expect(prompt).toContain('- asian cuisine');
    expect(prompt).toContain('- mediterranean cuisine');
  });

  it('adds normalized custom constraints and removes duplicates', () => {
    const prompt = buildGenerateRecipesUserPrompt(['tofu'], {
      customTags: ['Spicy', ' spicy ', 'low carb', 'line\nbreak', 'with`ticks`'],
    });

    expect(prompt).toContain('Custom constraints:');
    expect(prompt).toContain('- spicy');
    expect(prompt).toContain('- low carb');
    expect(prompt).toContain('- line break');
    expect(prompt).toContain('- with ticks');
    expect(prompt.split('- spicy').length).toBe(2);
  });
});

describe('POST /recipes/generate with extended filters', () => {
  it('accepts new preset filters and customTags', async () => {
    const response = await request(app)
      .post('/recipes/generate')
      .send({
        ingredients: ['chicken', 'rice'],
        filters: {
          asian: true,
          mediterranean: false,
          customTags: ['spicy', 'low carb'],
        },
      });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.recipes)).toBe(true);
  });

  it('rejects customTags longer than 32 characters', async () => {
    const response = await request(app)
      .post('/recipes/generate')
      .send({
        ingredients: ['chicken'],
        filters: {
          customTags: ['x'.repeat(33)],
        },
      });

    expect(response.status).toBe(400);
  });
});
