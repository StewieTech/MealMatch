import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { RecipeRequestModel } from '../models/RecipeRequest';
import { parseIngredients } from '../services/ingredient-parser.service';
import { generateRecipe } from '../services/recipe.service';

const TextBody = z.object({
  ingredientsText: z.string().min(1),
});

const ImageBody = z.object({
  imageKey: z.string().min(1),
});

const VoiceBody = z.object({
  audioBase64: z.string().min(1),
  mimeType: z.string().min(1),
});

export async function createRecipeFromText(req: Request, res: Response) {
  const parsed = TextBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'ingredientsText is required.' });
  }

  const ingredients = parseIngredients(parsed.data.ingredientsText);
  const recipe = await generateRecipe(ingredients);

  if (mongoose.connection.readyState === 1) {
    await RecipeRequestModel.create({
      source: 'text',
      rawInput: parsed.data.ingredientsText,
      normalizedIngredients: ingredients,
      recipe,
    });
  }

  return res.json({ source: 'text', ingredients, recipe });
}

export async function createRecipeFromImage(req: Request, res: Response) {
  const parsed = ImageBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'imageKey is required.' });
  }

  return res.status(501).json({
    source: 'image',
    imageKey: parsed.data.imageKey,
    message: 'Image-to-recipe flow is scaffolded but not implemented yet.',
  });
}

export async function createRecipeFromVoice(req: Request, res: Response) {
  const parsed = VoiceBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'audioBase64 and mimeType are required.' });
  }

  return res.status(501).json({
    source: 'voice',
    mimeType: parsed.data.mimeType,
    message: 'Voice-to-recipe flow is scaffolded but not implemented yet.',
  });
}