import { toFile } from 'openai';
import { getOpenAIClient } from './openai.service';

export type TranscriptionResult =
  | { ok: true; transcript: string }
  | { ok: false; reason: 'not_configured' | 'whisper_failed'; message: string };

function extensionFromMime(mimeType: string): string {
  const normalized = mimeType.toLowerCase();
  if (normalized.includes('m4a') || normalized.includes('mp4')) return 'm4a';
  if (normalized.includes('wav')) return 'wav';
  if (normalized.includes('mpeg') || normalized.includes('mp3')) return 'mp3';
  if (normalized.includes('webm')) return 'webm';
  if (normalized.includes('ogg')) return 'ogg';
  return 'm4a';
}

function sanitizeBase64(audioBase64: string): string {
  const commaIndex = audioBase64.indexOf(',');
  if (commaIndex !== -1 && audioBase64.slice(0, commaIndex).includes('base64')) {
    return audioBase64.slice(commaIndex + 1);
  }
  return audioBase64;
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string
): Promise<TranscriptionResult> {
  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      reason: 'not_configured',
      message: 'Voice transcription is not configured on the server.',
    };
  }

  try {
    const cleanBase64 = sanitizeBase64(audioBase64);
    const buffer = Buffer.from(cleanBase64, 'base64');
    const extension = extensionFromMime(mimeType);
    const file = await toFile(buffer, `recording.${extension}`, { type: mimeType });

    const response = await client.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });

    return { ok: true, transcript: response.text || '' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transcription failed.';
    console.error('[transcribeAudio] Whisper call failed:', message);
    return { ok: false, reason: 'whisper_failed', message };
  }
}