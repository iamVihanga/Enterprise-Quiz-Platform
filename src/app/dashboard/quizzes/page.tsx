import React from "react";
import { BookCopy, ListTodoIcon, PlusCircle } from "lucide-react";
import Link from "next/link";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { quizzesAuthContext } from "@/features/quizzes/quizzes-auth-context";
import { ClassSwitcher } from "@/features/classes/components/class-switcher";
import { LessonSelector } from "@/features/lessons/components/lesson-selector";

interface QuizzesPageProps {
  searchParams: Promise<{ active_lesson?: string }>;
}

export default async function QuizzesPage({ searchParams }: QuizzesPageProps) {
  const authContext = await quizzesAuthContext();
  const searchParamsList = await searchParams;
  const active_lesson = searchParamsList.active_lesson;

  if ("error" in authContext || !authContext.activeOrganization) {
    return (
      <div className="px-5 pb-5 flex-1 flex items-center justify-center w-full h-full">
        <Card className="w-full h-full bg-sidebar p-0 flex flex-col items-center justify-center">
          <div className="p-3 rounded-xl bg-primary dark:bg-secondary">
            <ListTodoIcon className="size-8 text-white" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-semibold">
            Select class to explore quizzes
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
          title="Explore Quizzes"
          description="Manage your all quizes here"
          actionComponent={
            <div className="flex items-center gap-2">
              <LessonSelector />

              {authContext.permissions["create"] && (
                <Button
                  disabled={!active_lesson}
                  asChild={active_lesson !== undefined}
                  icon={<PlusCircle />}
                >
                  <Link
                    href={`/dashboard/quizzes/new?active_lesson=${active_lesson}`}
                  >
                    Add new Quiz
                  </Link>
                </Button>
              )}
            </div>
          }
        />

        <Separator />

        {!active_lesson ? (
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <Card className="w-full h-full bg-sidebar p-0 flex flex-col items-center justify-center">
              <div className="p-3 rounded-xl bg-primary dark:bg-secondary">
                <BookCopy className="size-8 text-white" />
              </div>
              <h1 className="mt-5 font-heading text-2xl font-semibold">
                Select lesson to explore quizzes
              </h1>
              <p className="text-xs mt-1 text-foreground/60">
                You can select lesson with dropdown menu below
              </p>

              <div className="mt-4 w-48 border rounded-lg">
                <LessonSelector fullWidth />
              </div>
            </Card>
          </div>
        ) : (
          <>Quiz Listing goes here</>
        )}
      </div>
    </PageContainer>
  );
}
