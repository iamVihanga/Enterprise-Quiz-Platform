import React from "react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";
import { Separator } from "@/components/ui/separator";

export default function MaterialsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Lesson Materials"
          description="Manage your all lessons materials in here"
          actionComponent={<p>Add Lesson</p>}
        />

        <Separator />
      </div>
    </PageContainer>
  );
}
