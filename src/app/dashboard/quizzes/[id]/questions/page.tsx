"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader, XCircle } from "lucide-react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";

import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { useGetQuizById } from "@/features/quizzes/api/use-get-quiz-by-id";
import { QuestionsForm } from "@/features/quizzes/components/questions-form";
import { Card } from "@/components/ui/card";

export default function UpdateQuizPage() {
  const params = useParams<{ id: string }>();
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
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={"Questions for " + data.title}
          description="Add questions to created quiz"
          actionComponent={<></>}
        />

        <Separator />

        <QuestionsForm
          quizData={{
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          }}
        />
      </div>
    </PageContainer>
  );
}
