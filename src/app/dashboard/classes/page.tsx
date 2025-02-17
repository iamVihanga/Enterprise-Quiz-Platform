import React from "react";

import { AppPageShell } from "@/components/layouts/page-shell";
import { AddNewClass } from "@/features/classes/components/add-new-class-modal";
import ClassListing from "@/features/classes/components/class-listing";
import PageContainer from "@/components/layouts/page-container";
import { Separator } from "@/components/ui/separator";
import { ClassesTableActions } from "@/features/classes/components/classes-table/classes-table-actions";

export default function ClassesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Classes"
          description="Manage your all classes here"
          actionComponent={<AddNewClass />}
        />

        <Separator />

        <ClassesTableActions />

        <ClassListing />
      </div>
    </PageContainer>
  );
}
