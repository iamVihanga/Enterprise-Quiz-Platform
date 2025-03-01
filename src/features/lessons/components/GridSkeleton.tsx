import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array(6)
        .fill("_")
        .map((_, index) => (
          <Skeleton key={index} className="w-full h-48" />
        ))}
    </div>
  );
}
