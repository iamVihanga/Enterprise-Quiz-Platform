"use client";

import React, { useCallback, useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ImagesIcon, Loader, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { MediaService } from "@/modules/media/service";
import type { MediaFile, MediaType } from "@/modules/media/types";
import { getMediaType } from "../utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const mediaService = MediaService.getInstance();
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>();
  const [uploadResult, setUploadResult] = useState<MediaFile | null>(null);

  const uploadFileToastId = useId();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setAcceptedFiles(acceptedFiles);
      setUploadResult(null);
    },
    [onUpload, onError, acceptedTypes, path]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    multiple: false,
  });

  const handleFileUpload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setUploading(true);
      toast.loading("Uploading media...", { id: uploadFileToastId });

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

      toast.success("Media uploaded successfully !", {
        id: uploadFileToastId,
      });

      setUploadResult(result);
      onUpload(result);
    } catch (error) {
      const err = error as Error;
      toast.error("Failed to upload media", {
        id: uploadFileToastId,
        description: err.message,
      });
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Card
        {...getRootProps()}
        className={`p-0 w-full min-h-40 py-8 flex items-center justify-center border border-dashed rounded-lg ${
          isDragActive ? "border-foreground/60" : ""
        } transition-all ease-in-out duration-100 hover:bg-foreground/5`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {/* Icon component */}
          <div className="relative group">
            <ImagesIcon className={`size-8 opacity-90`} />
            <div className="absolute -bottom-2 -right-2 size-6 rounded-full bg-background flex items-center justify-center border">
              {!uploading ? (
                <UploadIcon className="size-4" strokeWidth={2} />
              ) : (
                <Loader className="size-4 animate-spin" strokeWidth={2} />
              )}
            </div>
          </div>

          <div className="space-y-1 flex flex-col items-center">
            {uploading ? (
              <p className="text-sm animate-pulse">Uploading Media...</p>
            ) : isDragActive ? (
              <p className="text-sm animate-pulse">Drop the file here</p>
            ) : (
              <p className="text-sm">Drag & drop a file, or click to select</p>
            )}

            <p className="text-xs text-foreground/60">
              {acceptedTypes.join(", ")} files only, Max size:{" "}
              {maxSize / (1024 * 1024)}MB
            </p>
          </div>

          {acceptedFiles.length > 0 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleFileUpload}
              disabled={uploading}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              Upload File
            </Button>
          ) : (
            <Button type="button" size="sm" variant={"outline"}>
              Select File
            </Button>
          )}
        </div>
      </Card>

      {acceptedFiles.length > 0 && !uploadResult && (
        <div className="flex items-center justify-between gap-2">
          <Image
            src={URL.createObjectURL(acceptedFiles[0])}
            alt="file"
            width={40}
            height={40}
            className="rounded-md size-14 object-cover"
          />

          <Button
            type="button"
            variant={"ghost"}
            size="sm"
            className="underline"
            onClick={() => setAcceptedFiles([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {uploadResult && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={"secondary"} className="cursor-pointer">
                <Link href={uploadResult.url} passHref target="_blank">
                  Preview Uploaded Media
                </Link>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is Uploaded Media Link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
