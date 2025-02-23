"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { MediaService } from "@/modules/media/service";
import type { MediaFile, MediaType } from "@/modules/media/types";
import { getMediaType } from "../utils";
import { Card } from "@/components/ui/card";

interface MediaUploaderProps {
  onUpload: (file: MediaFile) => void;
  onError: (error: Error) => void;
  acceptedTypes?: MediaType[];
  path?: string;
  maxSize?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  onError,
  acceptedTypes = ["image", "video", "document"],
  path = "",
  maxSize = 4 * 1024 * 1024,
}) => {
  const [uploading, setUploading] = useState<boolean>();
  const mediaService = MediaService.getInstance();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setUploading(true);

        const file = acceptedFiles[0];
        const type = getMediaType(file.type);

        if (!acceptedTypes.includes(type)) {
          throw new Error("File type not supported");
        }

        const result = await mediaService.uploadFile({
          file,
          type,
          path,
        });

        onUpload(result);
      } catch (error) {
        onError(error as Error);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, onError, acceptedTypes, path]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    multiple: false,
  });

  // return (
  //   <div
  //     {...getRootProps()}
  //     className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
  //   >
  //     <input {...getInputProps()} />
  //     {uploading ? (
  //       <p>Uploading...</p>
  //     ) : isDragActive ? (
  //       <p>Drop the file here...</p>
  //     ) : (
  //       <p>Drag & drop a file, or click to select</p>
  //     )}
  //   </div>
  // );

  return (
    <Card {...getRootProps()} className="p-0">
      Upload Photo
      <input {...getInputProps()} />
    </Card>
  );
};
