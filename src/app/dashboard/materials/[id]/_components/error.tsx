import { XIcon } from "lucide-react";
import React from "react";

interface ErrorProps {
  error: Error;
}

export function SingleMaterialError({ error }: ErrorProps) {
  return (
    <div className="flex flex-col flex-1 gap-2 items-center justify-center">
      <div className="bg-red-500/10 p-4 rounded-full">
        <XIcon size={48} className="size-8 text-red-500" />
      </div>

      <div className="space-y-1 text-center">
        <h2 className="text-xl font-semibold">Something went wrong !</h2>
        <p className="text-foreground/60 text-sm">{error.message}</p>
      </div>
    </div>
  );
}
