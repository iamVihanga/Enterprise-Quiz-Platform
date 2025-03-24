"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, FileQuestion } from "lucide-react";

import { QuizzesAuthContext } from "@/features/quizzes/quizzes-auth-context";
import { useGetQuizzes } from "@/features/quizzes/api/use-get-quizzes";
import { useQuizGridFilters } from "./use-quiz-grid-filters";
import { GridSkeleton } from "../grid-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { QuizCard } from "../quiz-card";
import { QuizGridPagination } from "./quizzes-grid-pagination";

import { authClient } from "@/features/auth/auth-client";
import { useLessonsGridFilters } from "@/features/lessons/components/lessons-grid/use-lessons-grid-filters";

interface Props {
  authContext: QuizzesAuthContext;
}

export function QuizzesListing({ authContext }: Props) {
  const { page, limit, searchQuery } = useQuizGridFilters();
  const { lessonId } = useLessonsGridFilters();
  const activeOrg = authClient.useActiveOrganization();
  const router = useRouter();

  const { data, error, isPending } = useGetQuizzes({
    limit,
    page,
    search: searchQuery,
    lessonId,
  });

  // This part is essential for listen org changes and refresh quizzes auth-context
  useEffect(() => {
    if (!activeOrg.data?.id) {
      return;
    }

    if (activeOrg.data?.id) {
      router.refresh();
    }
  }, [activeOrg.data?.id]);

  if (isPending) {
    return <GridSkeleton />;
  }

  if (!data || error) {
    return (
      <Card className="p-0">
        <CardContent className="p-4">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            Something went wrong !
          </CardTitle>
          <CardDescription className="mt-4">
            {error?.message || "Server error"}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className=" flex flex-col gap-8 flex-1">
        {data.pagination.total > 0 ? (
          <div className="flex-1 grid grid-cols-3 gap-4">
            {data.data.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz as any}
                authContext={authContext}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <FileQuestion className="size-12 text-foreground/60" />
            <div className="space-y-1 text-center">
              <h1 className="font-semibold text-xl font-heading">
                No any quizzes here
              </h1>
              <p className="text-foreground/60 text-sm">
                There are no quizzes available for selected lesson
              </p>
            </div>
          </div>
        )}

        <QuizGridPagination totalItems={data.pagination.total} />
      </div>
    </>
  );
}
