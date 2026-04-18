jest.mock('../services/upload.service', () => ({
  createUploadUrl: jest.fn().mockResolvedValue({
    uploadUrl: 'https://example.com/upload',
    fileUrl: 'https://example.com/file.jpg',
    imageKey: 'fridge-images/test.jpg',
  }),
}));

import request from 'supertest';
import { app } from '../app';

describe('POST /uploads/presign', () => {
  it('returns a presigned upload payload', async () => {
    const response = await request(app)
      .post('/uploads/presign')
      .send({ contentType: 'image/jpeg', extension: 'jpg' });

    expect(response.status).toBe(200);
    expect(response.body.imageKey).toBe('fridge-images/test.jpg');
  });
});