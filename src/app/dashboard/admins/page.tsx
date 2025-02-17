"use client";

import React from "react";
import { ListTodoIcon, Loader } from "lucide-react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/features/auth/auth-client";
import { AddNewClass } from "@/features/classes/components/add-new-class-modal";
import { ClassSwitcher } from "@/features/classes/components/class-switcher";

import AdminsListing from "@/features/admins/components/admin-listing";
import { AdminsTableActions } from "@/features/admins/components/admins-table/admin-table-actions";

export default function AdminsPage() {
  const {
    data: activeOrgData,
    error: activeOrgErr,
    isPending: activeOrgPending,
  } = authClient.useActiveOrganization();

  if (activeOrgPending) {
    return (
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (!activeOrgData || activeOrgErr) {
    return (
      <div className="px-5 pb-5 flex-1 flex items-center justify-center w-full h-full">
        <Card className="w-full h-full bg-sidebar p-0 flex flex-col items-center justify-center">
          <div className="p-3 rounded-xl bg-primary dark:bg-secondary">
            <ListTodoIcon className="size-8 text-white" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-semibold">
            Select class to Manage admins
          </h1>
          <p className="text-xs mt-1 text-foreground/60">
            You can select class with sidebar class switcher or following
            dropdown
          </p>

          <div className="mt-4 w-96">
            <ClassSwitcher />
          </div>

          <Separator className="my-4 w-96" />

          <AddNewClass />
        </Card>
      </div>
    );
  }

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Admins"
          description={`Manage admins in "${activeOrgData.name}"`}
          actionComponent={
            <div className="w-fit rounded-lg">
              <ClassSwitcher />
            </div>
          }
        />

        <Separator />

        <AdminsTableActions />

        <AdminsListing />
      </div>
    </PageContainer>
  );
}
