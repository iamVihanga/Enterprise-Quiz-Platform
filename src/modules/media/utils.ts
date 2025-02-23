import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

import { s3Client, s3Config } from "@/modules/media/config";
import { MediaType } from "@/modules/media/types";

// Utility functions
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();

  const hash = crypto.randomBytes(8).toString("hex");
  const name = originalName.split(".")[0];
  const extension = originalName.split(".").pop();

  return `${name}-${timestamp}-${hash}.${extension}`;
}

export function getMediaType(fileType: string): MediaType {
  if (fileType.startsWith("image/")) return "image";
  if (fileType.startsWith("video/")) return "video";
  return "document";
}

export async function generatePresignedUrl(key: string, expiresIn = 24 * 3600) {
  const command = new PutObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}
