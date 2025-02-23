"use client";

import React from "react";
import { MediaUploader } from "@/modules/media/components/MediaUploader";
import { MediaFile } from "@/modules/media/types";

export const ProfilePictureUpload = () => {
  const handleUpload = (file: MediaFile) => {
    // Update user profile with file.url
    console.log("Uploaded:", file.url);
  };

  return (
    <MediaUploader
      onUpload={handleUpload}
      onError={(error) => console.error(error)}
      acceptedTypes={["image"]}
      path="profiles"
      maxSize={2 * 1024 * 1024} // 2MB limit
    />
  );
};

export default function MediaTest() {
  return (
    <div>
      <ProfilePictureUpload />
    </div>
  );
}
