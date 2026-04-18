import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';

export async function createUploadUrl({ contentType, extension }: { contentType: string; extension: string }) {
  const safeExtension = extension.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
  const imageKey = `fridge-images/${randomUUID()}.${safeExtension}`;
  const client = new S3Client({ region: env.awsRegion });
  const command = new PutObjectCommand({
    Bucket: env.uploadsBucket,
    Key: imageKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });
  const fileUrl = `https://${env.uploadsBucket}.s3.${env.awsRegion}.amazonaws.com/${imageKey}`;

  return { uploadUrl, fileUrl, imageKey };
}