import { useId, useState } from "react";
import { toast } from "sonner";

import { MediaFile, UploadParams } from "@/modules/media/types";
import { MediaService } from "@/modules/media/service";

export const useMediaUpload = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const mediaService = MediaService.getInstance();
  const uploadToastId = useId();
  const deleteToastId = useId();

  const upload = async (params: UploadParams): Promise<MediaFile | null> => {
    try {
      setLoading(true);
      setError(null);
      // toast.loading("Uploading file...", { id: uploadToastId });

      const uploadedFile = await mediaService.uploadFile(params);

      toast.success("File uploaded successfully.!", { id: uploadToastId });
      return uploadedFile;
    } catch (err) {
      const error = err as Error;
      setError(error);

      toast.error("Failed to upload file...", {
        id: uploadToastId,
        description: error.message,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (key: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      toast.loading("Deleting file...", { id: deleteToastId });

      const deletedFile = await mediaService.deleteFile(key);

      toast.success("File deleted successfully.!", { id: deleteToastId });
      return deletedFile;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error("Failed to delete file...", {
        id: deleteToastId,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    upload,
    deleteFile,
    loading,
    error,
  };
};
