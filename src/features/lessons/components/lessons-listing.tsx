"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Presentation } from "lucide-react";

import { useGetLessons } from "../api/use-get-lessons";
import { useLessonsGridFilters } from "./lessons-grid/use-lessons-grid-filters";
import { GridSkeleton } from "./GridSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { LessonCard } from "./lesson-card";
import { LessonsGridPagination } from "./lessons-grid/lessons-grid-pagination";
import { authClient } from "@/features/auth/auth-client";

import { LessonsAuthContext } from "@/features/lessons/lessons-auth-context";

interface Props {
  authContext: LessonsAuthContext;
}

export function LessonsListing({ authContext }: Props) {
  const { page, limit, searchQuery } = useLessonsGridFilters();
  const activeOrg = authClient.useActiveOrganization();
  const router = useRouter();

  const { data, error, isPending } = useGetLessons({
    limit,
    page,
    search: searchQuery,
  });

  // This part is essential for listen org changes and refresh lessons auth-context
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
    <div className=" flex flex-col gap-8 flex-1">
      {data.pagination.total > 0 ? (
        <div className="flex-1 grid grid-cols-3 gap-4">
          {data.data.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson as any}
              authContext={authContext}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Presentation className="size-12 text-foreground/60" />
          <div className="space-y-1 text-center">
            <h1 className="font-semibold text-xl font-heading">
              No any lessons here
            </h1>
            <p className="text-foreground/60 text-sm">
              There are no lessons available for selected class
            </p>
          </div>
        </div>
      )}

      <LessonsGridPagination totalItems={data.pagination.total} />
    </div>
  );
}
