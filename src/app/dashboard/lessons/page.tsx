import React from "react";
import { ListTodoIcon } from "lucide-react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";
import { Separator } from "@/components/ui/separator";
import { AddLessonDialog } from "@/features/lessons/components/add-lesson-dialog";
import { Card } from "@/components/ui/card";
import { ClassSwitcher } from "@/features/classes/components/class-switcher";
import { LessonsListing } from "@/features/lessons/components/lessons-listing";
import { LessonsGridActions } from "@/features/lessons/components/lessons-grid/lessons-grid-actions";
import { lessonsAuthContext } from "@/features/lessons/lessons-auth-context";

export default async function LessonsPage() {
  const authContext = await lessonsAuthContext();

  if ("error" in authContext || !authContext.activeOrganization) {
    return (
      <div className="px-5 pb-5 flex-1 flex items-center justify-center w-full h-full">
        <Card className="w-full h-full bg-sidebar p-0 flex flex-col items-center justify-center">
          <div className="p-3 rounded-xl bg-primary dark:bg-secondary">
            <ListTodoIcon className="size-8 text-white" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-semibold">
            Select class to explore lessons
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
          title={`Manage Lessons`}
          description="Manage your all lessons for selected class in here"
          actionComponent={
            authContext.permissions["create"] && <AddLessonDialog />
          }
        />

        <Separator />

        <LessonsGridActions />

        <LessonsListing authContext={authContext} />
      </div>
    </PageContainer>
  );
}
