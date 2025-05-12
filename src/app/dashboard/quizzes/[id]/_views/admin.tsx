"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Loader, XIcon } from "lucide-react";

import PageContainer from "@/components/layouts/page-container";
import { useGetQuizById } from "@/features/quizzes/api/use-get-quiz-by-id";
import { TagList } from "@/features/quizzes/components/tag-list";
import { AppPageShell } from "@/components/layouts/page-shell";
import { Separator } from "@/components/ui/separator";

type Props = {
  activeOrganizationId: string;
};

export function AdminView({ activeOrganizationId }: Props) {
  const { id: quizId } = useParams<{ id: string }>();

  const { data, error, isPending } = useGetQuizById(quizId);

  if (isPending) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <div className="p-2 rounded-full bg-foreground/10">
            <Loader className="size-6 animate-spin" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <div className="p-2 rounded-full bg-foreground/10">
            <XIcon className="size-6" />
          </div>
          <h1 className="font-heading text-xl font-semibold">Quiz not found</h1>
        </div>
      </PageContainer>
    );
  }

  console.log(data, error);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={data?.title}
          description={`
            ${data?.description?.slice(0, 50) || ""} ${
            data?.description && data.description.length > 50 ? "..." : ""
          }
            `}
          actionComponent={<></>}
        />

        <Separator />

        <TagList activeOrganizationId={activeOrganizationId} />
      </div>
    </PageContainer>
  );
}
