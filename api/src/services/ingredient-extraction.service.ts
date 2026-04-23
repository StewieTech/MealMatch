import {
  EXTRACT_INGREDIENTS_SYSTEM_PROMPT,
  buildExtractIngredientsUserPrompt,
} from '../prompts/extract-ingredients';
import { parseIngredients } from './ingredient-parser.service';
import { getOpenAIClient } from './openai.service';

export type IngredientConfidence = 'high' | 'medium' | 'low';

export interface IngredientCandidate {
  raw: string;
  normalized: string;
  confidence: IngredientConfidence;
}

function normalizeConfidence(value: unknown): IngredientConfidence {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return 'medium';
}

function toCandidate(input: unknown): IngredientCandidate | null {
  if (!input || typeof input !== 'object') return null;
  const record = input as Record<string, unknown>;
  const raw = typeof record.raw === 'string' ? record.raw.trim() : '';
  const normalizedRaw =
    typeof record.normalized === 'string' ? record.normalized.trim().toLowerCase() : raw.toLowerCase();
  if (!normalizedRaw) return null;
  return {
    raw: raw || normalizedRaw,
    normalized: normalizedRaw,
    confidence: normalizeConfidence(record.confidence),
  };
}

function dedupe(candidates: IngredientCandidate[]): IngredientCandidate[] {
  const seen = new Set<string>();
  const result: IngredientCandidate[] = [];
  for (const candidate of candidates) {
    if (seen.has(candidate.normalized)) continue;
    seen.add(candidate.normalized);
    result.push(candidate);
  }
  return result;
}

function fallbackFromTranscript(transcript: string): IngredientCandidate[] {
  const items = parseIngredients(transcript);
  return items.map((value) => ({
    raw: value,
    normalized: value,
    confidence: 'low' as IngredientConfidence,
  }));
}

export async function extractIngredientsFromTranscript(
  transcript: string
): Promise<IngredientCandidate[]> {
  const trimmed = transcript.trim();
  if (!trimmed) return [];

  const client = getOpenAIClient();
  if (!client) {
    return fallbackFromTranscript(trimmed);
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: EXTRACT_INGREDIENTS_SYSTEM_PROMPT },
        { role: 'user', content: buildExtractIngredientsUserPrompt(trimmed) },
      ],
    });

    const raw = response.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(raw) as { ingredients?: unknown };
    if (!parsed || !Array.isArray(parsed.ingredients)) {
      return fallbackFromTranscript(trimmed);
    }

    const candidates = parsed.ingredients
      .map(toCandidate)
      .filter((candidate): candidate is IngredientCandidate => candidate !== null);

    const deduped = dedupe(candidates);
    return deduped.length > 0 ? deduped : fallbackFromTranscript(trimmed);
  } catch {
    return fallbackFromTranscript(trimmed);
  }
}
