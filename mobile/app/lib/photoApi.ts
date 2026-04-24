import { PhotoExtractResponse, VideoSearchResponse } from '../types/photo';
import { API_BASE } from './api';

type PhotoApiErrorReason =
  | 'not_configured'
  | 'network_failed'
  | 'payload_too_large'
  | 'unsupported_image_type'
  | 'vision_failed';

type ErrorPayload = {
  error?: string;
  reason?: PhotoApiErrorReason;
};

export class PhotoApiError extends Error {
  status: number;
  reason?: PhotoApiErrorReason;

  constructor(message: string, status: number, reason?: PhotoApiErrorReason) {
    super(message);
    this.name = 'PhotoApiError';
    Object.setPrototypeOf(this, PhotoApiError.prototype);
    this.status = status;
    this.reason = reason;
  }
}

function estimateBase64Bytes(input: string) {
  return Math.floor((input.length * 3) / 4);
}

export function classifyPhotoNetworkError(error: unknown): PhotoApiError | null {
  if (error instanceof PhotoApiError) return error;
  if (!(error instanceof Error)) return null;

  const message = error.message.toLowerCase();
  if (
    error instanceof TypeError ||
    message.includes('load failed') ||
    message.includes('failed to fetch') ||
    message.includes('network request failed')
  ) {
    return new PhotoApiError(
      'Network request failed before the server responded.',
      0,
      'network_failed'
    );
  }

  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    let reason: PhotoApiErrorReason | undefined;
    try {
      const data = (await response.json()) as ErrorPayload;
      if (data && typeof data.error === 'string') message = data.error;
      if (data && typeof data.reason === 'string') reason = data.reason;
    } catch {
      // ignore
    }
    throw new PhotoApiError(message, response.status, reason);
  }
  return response.json() as Promise<T>;
}

export async function extractIngredientsFromPhoto(
  imageBase64: string,
  mimeType: string
): Promise<PhotoExtractResponse> {
  const url = `${API_BASE}/photo/extract`;
  console.info('[MealMatch][photo] starting extract request', {
    url,
    mimeType,
    base64Length: imageBase64.length,
    estimatedBytes: estimateBase64Bytes(imageBase64),
  });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    const payload = await handleResponse<PhotoExtractResponse>(response);
    console.info('[MealMatch][photo] extract request succeeded', {
      ingredientCount: payload.ingredients.length,
    });
    return payload;
  } catch (error) {
    const classifiedError = classifyPhotoNetworkError(error) ?? error;
    if (classifiedError instanceof PhotoApiError) {
      console.error('[MealMatch][photo] extract request failed', {
        status: classifiedError.status,
        reason: classifiedError.reason ?? null,
        message: classifiedError.message,
        originalMessage: error instanceof Error ? error.message : null,
      });
    } else {
      console.error('[MealMatch][photo] extract request failed', {
        message: classifiedError instanceof Error ? classifiedError.message : 'Unknown error',
      });
    }
    throw classifiedError;
  }
}

export async function searchRecipeVideo(query: string): Promise<VideoSearchResponse> {
  const url = `${API_BASE}/videos/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { method: 'GET' });
  return handleResponse<VideoSearchResponse>(response);
}
