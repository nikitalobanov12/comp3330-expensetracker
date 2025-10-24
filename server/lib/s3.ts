import { S3Client } from "@aws-sdk/client-s3";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Expected ${key} to be set`);
  }
  return value;
};

export const s3 = new S3Client({
  region: requireEnv("S3_REGION"),
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: Boolean(process.env.S3_FORCE_PATH_STYLE),
  credentials: {
    accessKeyId: requireEnv("S3_ACCESS_KEY"),
    secretAccessKey: requireEnv("S3_SECRET_KEY"),
  },
});
