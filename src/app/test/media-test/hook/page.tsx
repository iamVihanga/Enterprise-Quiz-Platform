"use client";

import React from "react";
import { useMediaUpload } from "@/modules/media/hooks/useMediaUpload";

export const LessonMaterialUpload = () => {
  const { upload, loading, error } = useMediaUpload();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await upload({
        file,
        type: "document",
        path: "materials",
      });
      console.log(result);
      if (result) {
        // Update lesson material with result.url
      }
    }
  };

  return <input type="file" onChange={handleFileSelect} disabled={loading} />;
};

export default function MediaTestHook() {
  return (
    <div>
      <LessonMaterialUpload />
    </div>
  );
}
