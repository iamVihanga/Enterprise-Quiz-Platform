import { createImageUpload } from "novel";
import { toast } from "sonner";

// Image Module
import { MediaService } from "@/modules/media/service";
import { MediaUploadPaths } from "@/modules/media/types";

const onUpload = async (file: File) => {
  const mediaUploader = MediaService.getInstance();

  // Image uploader promise
  const promise = mediaUploader.uploadFile({
    file,
    path: MediaUploadPaths.MATERIAL_ASSETS,
  });

  // Initiate image upload promise
  return new Promise((resolve, reject) => {
    toast.promise(
      promise
        .then(async (res) => {
          if (res.url) {
            // Successfull image upload
            const { url } = res;

            const image = new Image();
            image.src = url;
            image.onload = () => {
              resolve(url);
            };
          } else {
            throw new Error("Error uploading image. Please try again.");
          }
        })
        .catch((err) => {
          reject(err);
        }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      }
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
