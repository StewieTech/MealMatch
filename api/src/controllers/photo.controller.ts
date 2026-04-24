import { Request, Response } from 'express';
import { z } from 'zod';
import { extractIngredientsFromImage } from '../services/vision.service';

const ExtractBody = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
});

export async function extractIngredientsFromPhoto(req: Request, res: Response) {
  const parsed = ExtractBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'imageBase64 and mimeType are required.' });
  }

  try {
    const result = await extractIngredientsFromImage(
      parsed.data.imageBase64,
      parsed.data.mimeType
    );
    if (!result.ok) {
      const status =
        result.reason === 'not_configured'
          ? 503
          : result.reason === 'unsupported_image_type'
            ? 400
            : 502;
      return res.status(status).json({ error: result.message, reason: result.reason });
    }
    return res.json({ ingredients: result.ingredients });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Vision extraction failed.';
    console.error('[extractIngredientsFromPhoto] unexpected error:', message);
    return res.status(500).json({ error: 'Vision extraction failed.' });
  }
}
