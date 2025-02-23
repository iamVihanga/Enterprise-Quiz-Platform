import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import type { UploadParams, MediaFile } from "@/modules/media/types";
import {
  generatePresignedUrl,
  generateUniqueFileName,
  getMediaType,
} from "@/modules/media/utils";
import { s3Client, s3Config } from "@/modules/media/config";

export class MediaService {
  private static instance: MediaService;

  private constructor() {}

  static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }

    return MediaService.instance;
  }

  async uploadFile({
    file,
    type,
    path = "",
  }: UploadParams): Promise<MediaFile> {
    const filename = generateUniqueFileName(file.name);
    const key = path ? `${path}/${filename}` : filename;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read", // This makes the object publicly readable
        CacheControl: "max-age=31536000", // Optional: 1 year cache
      })
    );

    return {
      id: key,
      url: `${s3Config.baseUrl}/${key}`,
      type: getMediaType(file.type),
      filename: filename,
      size: file.size,
      createdAt: new Date(),
    };
  }

  async deleteFile(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
      })
    );
  }

  async getPresignedUrl(filename: string, path = ""): Promise<string> {
    const key = path ? `${path}/${filename}` : filename;
    return await generatePresignedUrl(key);
  }
}
