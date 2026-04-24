import request from 'supertest';
import { app } from '../app';

describe('GET /videos/search', () => {
  it('returns 400 when q is missing', async () => {
    const response = await request(app).get('/videos/search');
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });

  it('returns 503 not_configured when YOUTUBE_API_KEY is missing', async () => {
    const originalKey = process.env.YOUTUBE_API_KEY;
    process.env.YOUTUBE_API_KEY = '';
    try {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app: freshApp } = require('../app');
      const response = await request(freshApp)
        .get('/videos/search')
        .query({ q: 'chicken stir fry' });
      expect(response.status).toBe(503);
      expect(response.body.reason).toBe('not_configured');
    } finally {
      if (originalKey === undefined) delete process.env.YOUTUBE_API_KEY;
      else process.env.YOUTUBE_API_KEY = originalKey;
    }
  });

  it('returns video payload when YouTube API returns a match', async () => {
    const originalKey = process.env.YOUTUBE_API_KEY;
    process.env.YOUTUBE_API_KEY = 'test-key';
    const originalFetch = global.fetch;

    global.fetch = jest.fn(async () =>
      new Response(
        JSON.stringify({
          items: [
            {
              id: { videoId: 'abc123' },
              snippet: {
                title: 'Chicken Stir-Fry Short',
                channelTitle: 'Test Chef',
                thumbnails: {
                  high: { url: 'https://img.example/high.jpg' },
                  medium: { url: 'https://img.example/med.jpg' },
                },
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    ) as unknown as typeof fetch;

    try {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app: freshApp } = require('../app');
      const response = await request(freshApp)
        .get('/videos/search')
        .query({ q: 'chicken stir fry' });

      expect(response.status).toBe(200);
      expect(response.body.videoId).toBe('abc123');
      expect(response.body.embedUrl).toContain('youtube.com/embed/abc123');
      expect(response.body.thumbnailUrl).toBe('https://img.example/high.jpg');
      expect(response.body.title).toBe('Chicken Stir-Fry Short');
      expect(response.body.channel).toBe('Test Chef');
    } finally {
      global.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.YOUTUBE_API_KEY;
      else process.env.YOUTUBE_API_KEY = originalKey;
    }
  });

  it('returns 404 when YouTube returns no items', async () => {
    const originalKey = process.env.YOUTUBE_API_KEY;
    process.env.YOUTUBE_API_KEY = 'test-key';
    const originalFetch = global.fetch;
    global.fetch = jest.fn(async () =>
      new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    ) as unknown as typeof fetch;

    try {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app: freshApp } = require('../app');
      const response = await request(freshApp)
        .get('/videos/search')
        .query({ q: 'something' });
      expect(response.status).toBe(404);
      expect(response.body.reason).toBe('no_results');
    } finally {
      global.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.YOUTUBE_API_KEY;
      else process.env.YOUTUBE_API_KEY = originalKey;
    }
  });
});
