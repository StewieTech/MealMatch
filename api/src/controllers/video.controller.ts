import { Request, Response } from 'express';
import { z } from 'zod';
import { searchRecipeShort } from '../services/youtube.service';

const Query = z.object({
  q: z.string().min(1),
});

export async function searchRecipeVideo(req: Request, res: Response) {
  const parsed = Query.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'q query parameter is required.' });
  }

  try {
    const result = await searchRecipeShort(parsed.data.q);
    if (!result.ok) {
      const status = result.reason === 'not_configured' ? 503 : 502;
      return res.status(status).json({ error: result.message, reason: result.reason });
    }
    if (!result.video) {
      return res.status(404).json({ error: 'No matching video found.', reason: 'no_results' });
    }
    return res.json(result.video);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Video search failed.';
    console.error('[searchRecipeVideo] unexpected error:', message);
    return res.status(500).json({ error: 'Video search failed.' });
  }
}
