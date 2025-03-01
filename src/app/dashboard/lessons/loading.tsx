import PageContainer from "@/components/layouts/page-container";
import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col items-center justify-center space-y-4">
        <Loader2 className="size-4 animate-spin" />
      </div>
    </PageContainer>
  );
}
