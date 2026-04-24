import request from 'supertest';
import { app } from '../app';

const allowedStagingWebOrigin = 'https://d1jvmkdzx7bn57.cloudfront.net';

describe('POST /photo/extract', () => {
  it('handles CORS preflight for the staging web origin', async () => {
    const response = await request(app)
      .options('/photo/extract')
      .set('Origin', allowedStagingWebOrigin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(allowedStagingWebOrigin);
    expect(response.headers['access-control-allow-methods']).toContain('POST');
  });

  it('returns 400 when imageBase64 is missing', async () => {
    const response = await request(app)
      .post('/photo/extract')
      .send({ mimeType: 'image/jpeg' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });

  it('returns 400 when mimeType is missing', async () => {
    const response = await request(app)
      .post('/photo/extract')
      .send({ imageBase64: 'abc' });

    expect(response.status).toBe(400);
  });

  it('returns 503 not_configured when OPENAI_API_KEY is missing', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = '';
    try {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app: freshApp } = require('../app');
      const response = await request(freshApp)
        .post('/photo/extract')
        .send({
          imageBase64: Buffer.from('stub-image').toString('base64'),
          mimeType: 'image/jpeg',
        });
      expect(response.status).toBe(503);
      expect(response.body.reason).toBe('not_configured');
      expect(typeof response.body.error).toBe('string');
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
    }
  });

  it('returns 400 unsupported_image_type before calling vision', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'test-key';
    try {
      jest.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app: freshApp } = require('../app');
      const response = await request(freshApp)
        .post('/photo/extract')
        .send({
          imageBase64: Buffer.from('stub-image').toString('base64'),
          mimeType: 'image/bmp',
        });

      expect(response.status).toBe(400);
      expect(response.body.reason).toBe('unsupported_image_type');
      expect(response.body.error).toContain('Unsupported image type');
    } finally {
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
    }
  });

  it('returns JSON 413 when the request body is too large', async () => {
    const largeBody = JSON.stringify({
      imageBase64: 'a'.repeat(11 * 1024 * 1024),
      mimeType: 'image/jpeg',
    });

    const response = await request(app)
      .post('/photo/extract')
      .set('Content-Type', 'application/json')
      .send(largeBody);

    expect(response.status).toBe(413);
    expect(response.body.reason).toBe('payload_too_large');
    expect(response.body.error).toBe('Image payload too large.');
  });
});
