"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader, LockIcon, XCircle } from "lucide-react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";

import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetQuizById } from "@/features/quizzes/api/use-get-quiz-by-id";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizUpdateForm } from "@/features/quizzes/components/quiz-update-form";

export default function UpdateQuizPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const { data, error, isPending } = useGetQuizById(params.id);

  // Collape the sidebar when the page is loaded
  useEffect(() => {
    state === "expanded" && toggleSidebar();
  }, []);

  if (isPending) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="p-2 rounded-full bg-foreground/10">
            <Loader className="size-6 animate-spin" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <div className="px-5 pb-5 flex-1 flex items-center justify-center w-full h-full">
        <Card className="w-full h-full bg-sidebar p-0 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-destructive/10">
            <XCircle className="size-8 text-destructive" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-semibold">
            Something Went Wrong
          </h1>
          <p className="text-xs mt-1 text-foreground/60">
            {error?.message || "Failed to fetch quiz data"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <PageContainer scrollable={true}>
      <Tabs className="flex flex-1 flex-col space-y-4" defaultValue="quiz">
        <AppPageShell
          title={`Update Quiz`}
          description="Update quiz details & questions"
          actionComponent={
            <div className="flex items-center gap-3">
              <TabsList>
                <TabsTrigger value="quiz">Quiz Details</TabsTrigger>
                <TabsTrigger value="questions" disabled>
                  {/* Todo: Remove after implement update */}
                  <LockIcon className="size-4 mr-2" />
                  Questions
                </TabsTrigger>
              </TabsList>

              <Button icon={<ArrowLeft />} onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          }
        />

        <Separator />

        <TabsContent value="quiz">
          <QuizUpdateForm
            data={{
              ...data,
              createdAt: new Date(data.createdAt),
              updatedAt: new Date(data.updatedAt),
            }}
          />
        </TabsContent>

        <TabsContent value="questions"></TabsContent>
      </Tabs>
    </PageContainer>
  );
}
