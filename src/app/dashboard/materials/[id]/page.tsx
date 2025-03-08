"use client";

import React from "react";
import { useParams } from "next/navigation";

import { useGetMaterial } from "@/features/materials/api/use-get-material-by-id";
import { Separator } from "@/components/ui/separator";
import { NovelEditor } from "@/features/novel/components/editor";

export default function SingleMaterialPage() {
  const params = useParams<{ id: string }>();

  const { data, isPending, error } = useGetMaterial({
    materialId: params.id,
  });

  if (isPending) {
    return <div className="">Loading...</div>;
  }

  if (error || !data) {
    return (
      <div className="">
        Error: {error?.message || "Something went wrong !"}
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <h1 className="text-2xl font-semibold mb-1">{data.name}</h1>
      <p className="text-sm text-foreground/60">{data.description}</p>

      <Separator className="my-4" />

      <NovelEditor
        value={data.content || "{}"}
        onChange={(value) => {}}
        previewMode
      />
    </div>
  );
}
