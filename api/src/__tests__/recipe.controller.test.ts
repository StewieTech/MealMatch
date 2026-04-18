import request from 'supertest';
import { app } from '../app';

describe('POST /recipes/from-text', () => {
  it('parses ingredients and returns a recipe payload', async () => {
    const response = await request(app)
      .post('/recipes/from-text')
      .send({ ingredientsText: 'chicken, rice, spinach' });

    expect(response.status).toBe(200);
    expect(response.body.source).toBe('text');
    expect(response.body.ingredients).toEqual(['chicken', 'rice', 'spinach']);
    expect(response.body.recipe.title).toBeTruthy();
    expect(Array.isArray(response.body.recipe.steps)).toBe(true);
  });
});