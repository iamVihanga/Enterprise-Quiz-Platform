import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function SingleMaterialLoading() {
  return (
    <div className="px-5 py-4 flex-1 flex flex-col">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      <Separator className="my-4" />

      <Skeleton className="flex-1" />
    </div>
  );
}
