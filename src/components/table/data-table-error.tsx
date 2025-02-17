import React from "react";
import { Card } from "../ui/card";
import { XIcon } from "lucide-react";

type Props = { error?: any };

export default function DataTableError({ error }: Props) {
  return (
    <Card className="flex flex-1 flex-col items-center justify-center h-full p-0">
      <div className="p-3 rounded-full bg-red-500/10">
        <XIcon className="size-8 text-red-500" />
      </div>

      <p className="mt-4 text-lg text-foreground font-semibold">
        {"Something Went Wrong !"}
      </p>
      <p className="mt-1 text-foreground/60 text-sm">
        {error ? error?.message : "Unknown Error"}
      </p>
    </Card>
  );
}
