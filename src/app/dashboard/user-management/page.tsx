"use client";

import React from "react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";
import { Separator } from "@/components/ui/separator";

import UsersListing from "@/features/users/components/users-listing";
import { UsersTableActions } from "@/features/users/components/users-table/users-table-actions";
import { CreateUserDialog } from "@/features/users/components/create-user-dialog";

export default function StudentsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="User Management"
          description={`Manage all users registered on the platform`}
          actionComponent={<CreateUserDialog />}
        />

        <Separator />

        <UsersTableActions />

        <UsersListing />
      </div>
    </PageContainer>
  );
}
