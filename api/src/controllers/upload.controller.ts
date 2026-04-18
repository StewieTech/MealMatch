import { Request, Response } from 'express';
import { z } from 'zod';
import { createUploadUrl } from '../services/upload.service';

const UploadBody = z.object({
  contentType: z.string().min(1),
  extension: z.string().min(1),
});

export async function presignUpload(req: Request, res: Response) {
  const parsed = UploadBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'contentType and extension are required.' });
  }

  const upload = await createUploadUrl(parsed.data);
  return res.json(upload);
}