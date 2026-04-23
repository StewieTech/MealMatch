import { Request, Response } from 'express';
import { z } from 'zod';
import { extractIngredientsFromTranscript } from '../services/ingredient-extraction.service';
import { generateRecipes } from '../services/recipe-generation.service';
import { transcribeAudio } from '../services/transcription.service';

const TranscribeBody = z.object({
  audioBase64: z.string().min(1),
  mimeType: z.string().min(1),
});

const FilterSchema = z
  .object({
    quickMeal: z.boolean().optional(),
    highProtein: z.boolean().optional(),
    vegetarian: z.boolean().optional(),
  })
  .optional();

const GenerateBody = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
  filters: FilterSchema,
});

export async function transcribeVoice(req: Request, res: Response) {
  const parsed = TranscribeBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'audioBase64 and mimeType are required.' });
  }

  try {
    const result = await transcribeAudio(parsed.data.audioBase64, parsed.data.mimeType);
    if (!result.ok) {
      const status = result.reason === 'not_configured' ? 503 : 502;
      return res.status(status).json({ error: result.message, reason: result.reason });
    }
    const ingredients = await extractIngredientsFromTranscript(result.transcript);
    return res.json({ transcript: result.transcript, ingredients });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transcription failed.';
    console.error('[transcribeVoice] unexpected error:', message);
    return res.status(500).json({ error: 'Transcription failed.' });
  }
}

export async function generateRecipesFromIngredients(req: Request, res: Response) {
  const parsed = GenerateBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'At least one ingredient is required.' });
  }

  try {
    const { recipes } = await generateRecipes(parsed.data.ingredients, parsed.data.filters || {});
    return res.json({ count: recipes.length, recipes });
  } catch {
    return res.status(500).json({ error: 'Recipe generation failed.' });
  }
}
