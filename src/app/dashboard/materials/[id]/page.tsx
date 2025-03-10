"use client";

import React from "react";
import { useParams } from "next/navigation";

import { useGetMaterial } from "@/features/materials/api/use-get-material-by-id";
import { Separator } from "@/components/ui/separator";
import { NovelEditor } from "@/features/novel/components/editor";
import { SingleMaterialLoading } from "./_components/loading";
import { SingleMaterialError } from "./_components/error";

export default function SingleMaterialPage() {
  const params = useParams<{ id: string }>();

  const { data, isPending, error } = useGetMaterial({
    materialId: params.id,
  });

  if (isPending) {
    return <SingleMaterialLoading />;
  }

  if (error || !data) {
    return <SingleMaterialError error={error || Error("Server Error")} />;
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
