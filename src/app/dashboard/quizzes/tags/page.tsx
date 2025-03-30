import React from "react";
import { ListTodoIcon, XIcon } from "lucide-react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

import { quizzesAuthContext } from "@/features/quizzes/quizzes-auth-context";
import { AddNewTag } from "@/features/tags/components/add-new-tag";
import { ClassSwitcher } from "@/features/classes/components/class-switcher";
import { TagTableActions } from "@/features/tags/components/tags-table/tag-table-actions";
import TagsListing from "@/features/tags/components/tags-listing";

type Props = {};

export default async function QuizTags({}: Props) {
  const authContext = await quizzesAuthContext();

  if ("error" in authContext || !authContext.permissions["create"]) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
            <XIcon className="size-8 text-red-500" />
          </div>

          <h2 className="text-sm text-foreground/80">Something Went Wrong !</h2>
        </div>
      </PageContainer>
    );
  }

  if (!authContext.activeOrganization) {
    return (
      <div className="px-5 pb-5 flex-1 flex items-center justify-center w-full h-full">
        <Card className="w-full h-full bg-sidebar p-0 flex flex-col items-center justify-center">
          <div className="p-3 rounded-xl bg-primary dark:bg-secondary">
            <ListTodoIcon className="size-8 text-white" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-semibold">
            Select class to manage tags
          </h1>
          <p className="text-xs mt-1 text-foreground/60">
            You can select class with sidebar class switcher or following
            dropdown
          </p>

          <div className="mt-4 w-48 border rounded-lg">
            <ClassSwitcher />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Categories"
          description={"Categorize your quizzes by adding tags"}
          actionComponent={
            <div className="w-full flex-1 flex justify-end">
              <AddNewTag />
            </div>
          }
        />

        <Separator />

        <TagTableActions />

        <TagsListing />
      </div>
    </PageContainer>
  );
}
