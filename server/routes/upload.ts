import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { requireAuth } from "../auth/requireAuth";
import { s3 } from "../lib/s3";

const signPayloadSchema = z.object({
  filename: z.string().min(1),
  type: z.string().min(1),
});

const bucket = process.env.S3_BUCKET;
if (!bucket) {
  throw new Error("Expected S3_BUCKET to be configured");
}

export const uploadRoute = new Hono().post(
  "/sign",
  zValidator("json", signPayloadSchema),
  async (c) => {
    const err = await requireAuth(c);
    if (err) return err;

    const { filename, type } = c.req.valid("json");
    const key = `uploads/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: type,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return c.json({ uploadUrl, key });
  },
);
