import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 is S3-compatible, so the regular AWS S3 SDK works against Cloudflare's endpoint.
// Only ever use this inside server code (route handlers / server actions) — never
// import it into a Client Component, since it needs the (secret) R2 access keys.
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;

// Screenshots are stored in the same private bucket as mod files, so even just
// *displaying* one (unlike the purchase-gated mod file) needs a signed URL —
// just a longer-lived one since browsing shouldn't require a purchase.
export async function getScreenshotUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
  return getSignedUrl(r2Client, command, { expiresIn: 3600 });
}
