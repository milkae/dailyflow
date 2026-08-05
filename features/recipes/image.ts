"use server";

import { verifySession } from "@/lib/dal";
import { randomUUID } from "crypto";
import { s3, BUCKET } from "@/lib/s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MIN_SIZE_BYTES = 1;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function getRecipeImageUploadUrl(
  filename: string,
  contentType: string,
) {
  const session = await verifySession();

  if (!ACCEPTED_TYPES.includes(contentType)) {
    throw new Error("Unsupported image type.");
  }

  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 100);
  const key = `recipes/${session.userId}/${randomUUID()}-${safeName}`;

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: BUCKET,
    Key: key,
    Conditions: [
      ["content-length-range", MIN_SIZE_BYTES, MAX_SIZE_BYTES],
      ["eq", "$Content-Type", contentType],
    ],
    Fields: {
      "Content-Type": contentType,
    },
    Expires: 300, // seconds
  });

  return { url, fields, key };
}

export async function deleteRecipeImage(key: string) {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch (err) {
    // best-effort cleanup — don't fail the request over a stray object
    console.error("Failed to delete recipe image", key, err);
  }
}
