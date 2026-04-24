import request from 'supertest';
import { app } from '../app';

const allowedStagingWebOrigin = 'https://d1jvmkdzx7bn57.cloudfront.net';

describe('POST /voice/transcribe', () => {
  it('handles CORS preflight for the staging web origin', async () => {
    const response = await request(app)
      .options('/voice/transcribe')
      .set('Origin', allowedStagingWebOrigin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(allowedStagingWebOrigin);
    expect(response.headers['access-control-allow-methods']).toContain('POST');
  });

  it('handles CORS preflight for an env-provided production web origin', async () => {
    const originalOrigins = process.env.CORS_ALLOWED_ORIGINS;
    const allowedProdWebOrigin = 'https://prod-example.cloudfront.net';

    process.env.CORS_ALLOWED_ORIGINS = [
      allowedProdWebOrigin,
      allowedStagingWebOrigin,
      'http://localhost:8082',
      'http://localhost:19006',
    ].join(',');

    try {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app: freshApp } = require('../app');
      const response = await request(freshApp)
        .options('/voice/transcribe')
        .set('Origin', allowedProdWebOrigin)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'content-type');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe(allowedProdWebOrigin);
      expect(response.headers['access-control-allow-methods']).toContain('POST');
    } finally {
      if (originalOrigins === undefined) delete process.env.CORS_ALLOWED_ORIGINS;
      else process.env.CORS_ALLOWED_ORIGINS = originalOrigins;
      jest.resetModules();
    }
  });

  it('rejects CORS preflight for unknown origins', async () => {
    const response = await request(app)
      .options('/voice/transcribe')
      .set('Origin', 'https://unknown-origin.example')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('CORS origin not allowed.');
  });

  it('returns 400 when audioBase64 is missing', async () => {
    const response = await request(app).post('/voice/transcribe').send({ mimeType: 'audio/m4a' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });

  it('returns 400 when mimeType is missing', async () => {
    const response = await request(app)
      .post('/voice/transcribe')
      .send({ audioBase64: 'abc' });

    expect(response.status).toBe(400);
  });

  it('responds with a transcript shape on success OR a 503/502 error when transcription is unavailable', async () => {
    const response = await request(app)
      .post('/voice/transcribe')
      .send({
        audioBase64: Buffer.from('stub-audio').toString('base64'),
        mimeType: 'audio/m4a',
      });

    expect([200, 502, 503]).toContain(response.status);

    if (response.status === 200) {
      expect(typeof response.body.transcript).toBe('string');
      expect(Array.isArray(response.body.ingredients)).toBe(true);
    } else {
      expect(response.body.error).toBeTruthy();
      expect(['not_configured', 'whisper_failed']).toContain(response.body.reason);
    }
  });

  it('returns 503 with a clear message when OPENAI_API_KEY is not configured', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = '';
    try {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app: freshApp } = require('../app');
      const response = await request(freshApp)
        .post('/voice/transcribe')
        .send({
          audioBase64: Buffer.from('stub-audio').toString('base64'),
          mimeType: 'audio/m4a',
        });
      expect(response.status).toBe(503);
      expect(response.body.reason).toBe('not_configured');
      expect(typeof response.body.error).toBe('string');
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
    }
  });
});
