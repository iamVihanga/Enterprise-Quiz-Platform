import React from "react";
import { Logo } from "@/components/app-logo";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  children: React.ReactNode;
};

export default function ResetPasswordLayout({ children }: Props) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <Logo />

      {/* Form Skelaton */}
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-full h-12" />
        </div>
        <div className="space-y-1">
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-full h-12" />
        </div>

        <Skeleton className="w-full h-14" />
      </div>
    </div>
  );
}
