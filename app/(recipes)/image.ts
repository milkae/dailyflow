"use server";

import { verifySession } from "@/lib/dal";
import { randomUUID } from "crypto";
import { s3, BUCKET } from "@/lib/s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { ACCEPTED_TYPES, MAX_SIZE_BYTES, MIN_SIZE_BYTES } from "./types";

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

export async function uploadExternalImage(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch image");

  const contentType = (response.headers.get("content-type") || "").split(
    ";",
  )[0];
  if (!ACCEPTED_TYPES.includes(contentType)) {
    throw new Error("Unsupported image type");
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_SIZE_BYTES) {
    throw new Error("Image too large");
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_SIZE_BYTES) {
    throw new Error("Image too large");
  }

  // Derive a filename from the URL path
  let safeName = "image";
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "image";
    safeName = last.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 100);
  } catch {
    // ignore
  }

  const key = `recipes/${"public"}/${randomUUID()}-${safeName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: contentType,
    }),
  );

  return key;
}
