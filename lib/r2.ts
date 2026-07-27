import { S3Client } from '@aws-sdk/client-s3';

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
