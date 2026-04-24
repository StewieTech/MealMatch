import { env } from '../config/env';

export interface YouTubeShortResult {
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  embedUrl: string;
}

export type YouTubeSearchResult =
  | { ok: true; video: YouTubeShortResult | null }
  | { ok: false; reason: 'not_configured' | 'search_failed'; message: string };

const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

export async function searchRecipeShort(query: string): Promise<YouTubeSearchResult> {
  if (!env.youTubeApiKey) {
    return {
      ok: false,
      reason: 'not_configured',
      message: 'YouTube search is not configured on the server.',
    };
  }
  const trimmed = query.trim();
  if (!trimmed) {
    return { ok: true, video: null };
  }

  const params = new URLSearchParams({
    key: env.youTubeApiKey,
    part: 'snippet',
    type: 'video',
    videoDuration: 'short',
    videoEmbeddable: 'true',
    maxResults: '1',
    safeSearch: 'moderate',
    q: `${trimmed} recipe short`,
  });

  try {
    const response = await fetch(`${SEARCH_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
      const text = await response.text();
      console.error('[searchRecipeShort] non-ok response', response.status, text);
      return {
        ok: false,
        reason: 'search_failed',
        message: `YouTube search failed (${response.status}).`,
      };
    }
    const data = (await response.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: {
          title?: string;
          channelTitle?: string;
          thumbnails?: {
            high?: { url?: string };
            medium?: { url?: string };
            default?: { url?: string };
          };
        };
      }>;
    };

    const item = data.items?.[0];
    const videoId = item?.id?.videoId || '';
    if (!videoId) {
      return { ok: true, video: null };
    }
    const snippet = item?.snippet;
    const thumbs = snippet?.thumbnails;
    const thumbnailUrl =
      thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url || '';

    return {
      ok: true,
      video: {
        videoId,
        title: snippet?.title || trimmed,
        channel: snippet?.channelTitle || '',
        thumbnailUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'YouTube search failed.';
    console.error('[searchRecipeShort] fetch failed:', message);
    return { ok: false, reason: 'search_failed', message };
  }
}
