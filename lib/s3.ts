import { S3Client } from "@aws-sdk/client-s3";

// Public-read S3 bucket that backs admin/customer image uploads. Configured via
// Amplify environment variables; absent in local dev unless an .env is set.
export const S3_BUCKET = process.env.S3_UPLOAD_BUCKET ?? "";
export const S3_REGION = process.env.S3_UPLOAD_REGION ?? "ap-south-1";
export const S3_PUBLIC_BASE_URL =
  process.env.S3_PUBLIC_BASE_URL ?? (S3_BUCKET ? `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com` : "");

let client: S3Client | null = null;

export function getS3Client() {
  if (client) return client;

  const accessKeyId = process.env.S3_UPLOAD_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_UPLOAD_SECRET_ACCESS_KEY;

  client = new S3Client({
    region: S3_REGION,
    // Use the explicit keys when provided (Amplify); otherwise fall back to the
    // default AWS credential provider chain (roles, local profiles, etc.).
    credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  });

  return client;
}

export function isS3Configured() {
  return Boolean(S3_BUCKET);
}
