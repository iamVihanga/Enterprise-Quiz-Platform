"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import PageContainer from "@/components/layouts/page-container";
import { AppPageShell } from "@/components/layouts/page-shell";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuizSetupForm } from "@/features/quizzes/components/quiz-setup-form";

export default function AddNewQuizPage() {
  const { state, toggleSidebar } = useSidebar();
  const router = useRouter();

  // Collape the sidebar when the page is loaded
  useEffect(() => {
    state === "expanded" && toggleSidebar();
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Add new Quiz"
          description="Setup your quiz and add questions"
          actionComponent={
            <Button
              icon={<ArrowLeft />}
              onClick={() => router.push("/dashboard/quizzes")}
            >
              Back
            </Button>
          }
        />

        <Separator />

        <QuizSetupForm
          onSubmit={(data) => {
            router.push(`/dashboard/quizzes/${data.id}/questions`);
          }}
        />
      </div>
    </PageContainer>
  );
}
