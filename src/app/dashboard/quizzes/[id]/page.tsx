import React from "react";
import { redirect } from "next/navigation";

import { quizzesAuthContext } from "@/features/quizzes/quizzes-auth-context";
import { TagList } from "@/features/quizzes/components/tag-list";
import { AdminView } from "./_views/admin";

export default async function DashboardQuizPage() {
  const authContext = await quizzesAuthContext();

  if ("error" in authContext || !authContext.activeOrganization) {
    redirect("/dashboard/quizzes");
  }

  if (authContext.activeMember?.role !== "member") {
    return (
      <AdminView activeOrganizationId={authContext.activeOrganization.id} />
    );
  }

  return (
    <div>
      {/* 
            * In this page,
    
            - User: Can see the quiz analytics and details about retake attempts
        */}
    </div>
  );
}
