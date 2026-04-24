import {
  EXTRACT_INGREDIENTS_VISION_SYSTEM_PROMPT,
  EXTRACT_INGREDIENTS_VISION_USER_PROMPT,
} from '../prompts/extract-ingredients-vision';
import { IngredientCandidate } from './ingredient-extraction.service';
import { getOpenAIClient } from './openai.service';

export type VisionExtractionResult =
  | { ok: true; ingredients: IngredientCandidate[] }
  | {
      ok: false;
      reason: 'not_configured' | 'unsupported_image_type' | 'vision_failed';
      message: string;
    };

type IngredientConfidence = 'high' | 'medium' | 'low';

function normalizeConfidence(value: unknown): IngredientConfidence {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return 'medium';
}

function toCandidate(input: unknown): IngredientCandidate | null {
  if (!input || typeof input !== 'object') return null;
  const record = input as Record<string, unknown>;
  const raw = typeof record.raw === 'string' ? record.raw.trim() : '';
  const normalized =
    typeof record.normalized === 'string' ? record.normalized.trim().toLowerCase() : raw.toLowerCase();
  if (!normalized) return null;
  return {
    raw: raw || normalized,
    normalized,
    confidence: normalizeConfidence(record.confidence),
  };
}

function dedupe(candidates: IngredientCandidate[]): IngredientCandidate[] {
  const seen = new Set<string>();
  const out: IngredientCandidate[] = [];
  for (const c of candidates) {
    if (seen.has(c.normalized)) continue;
    seen.add(c.normalized);
    out.push(c);
  }
  return out;
}

function sanitizeBase64(input: string): string {
  return input.includes(',') ? input.split(',').pop() || '' : input;
}

function normalizeVisionMimeType(input: string) {
  const mimeType = input.trim().toLowerCase();
  if (
    mimeType === 'image/jpeg' ||
    mimeType === 'image/jpg' ||
    mimeType === 'image/heic' ||
    mimeType === 'image/heif'
  ) {
    return 'image/jpeg';
  }
  if (mimeType === 'image/png' || mimeType === 'image/webp' || mimeType === 'image/gif') {
    return mimeType;
  }
  return null;
}

export async function extractIngredientsFromImage(
  imageBase64: string,
  mimeType: string
): Promise<VisionExtractionResult> {
  const cleanBase64 = sanitizeBase64(imageBase64);
  if (!cleanBase64) {
    return { ok: false, reason: 'vision_failed', message: 'Image payload was empty.' };
  }
  const normalizedMimeType = normalizeVisionMimeType(mimeType);
  console.info('[extractIngredientsFromImage] received image payload', {
    requestedMimeType: mimeType,
    normalizedMimeType,
    base64Length: cleanBase64.length,
  });
  if (!normalizedMimeType) {
    return {
      ok: false,
      reason: 'unsupported_image_type',
      message: 'Unsupported image type. Use JPG, PNG, WebP, or non-animated GIF.',
    };
  }

  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      reason: 'not_configured',
      message: 'Vision ingredient extraction is not configured on the server.',
    };
  }

  const dataUrl = `data:${normalizedMimeType};base64,${cleanBase64}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: EXTRACT_INGREDIENTS_VISION_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: EXTRACT_INGREDIENTS_VISION_USER_PROMPT },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(raw) as { ingredients?: unknown };
    if (!parsed || !Array.isArray(parsed.ingredients)) {
      return { ok: true, ingredients: [] };
    }
    const candidates = parsed.ingredients
      .map(toCandidate)
      .filter((c): c is IngredientCandidate => c !== null);
    return { ok: true, ingredients: dedupe(candidates) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Vision call failed.';
    console.error('[extractIngredientsFromImage] vision call failed:', {
      message,
      mimeType: normalizedMimeType,
      base64Length: cleanBase64.length,
    });
    return { ok: false, reason: 'vision_failed', message };
  }
}
