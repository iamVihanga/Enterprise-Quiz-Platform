import PageContainer from "@/components/layouts/page-container";
import { Loader } from "lucide-react";
import React from "react";

export default function LoadingPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col items-center justify-center space-y-4">
        <div className="p-2 rounded-full bg-foreground/10">
          <Loader className="size-6 animate-spin" />
        </div>
      </div>
    </PageContainer>
  );
}
