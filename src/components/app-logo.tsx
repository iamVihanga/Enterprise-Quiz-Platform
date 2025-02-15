import { cn } from "@/lib/utils";
import { BrainIcon } from "lucide-react";
import React from "react";

type Props = {
  className?: string;
  iconClass?: string;
};

export function Logo({ className, iconClass }: Props) {
  return (
    <h1
      className={cn(
        "text-lg font-semibold font-heading flex items-center gap-2",
        className
      )}
    >
      <BrainIcon className={cn("size-6", iconClass)} />
      Quiz App
    </h1>
  );
}
