import React from "react";
import { redirect } from "next/navigation";

import { quizzesAuthContext } from "@/features/quizzes/quizzes-auth-context";
import { TagList } from "@/features/quizzes/components/tag-list";

export default async function DashboardQuizPage() {
  const authContext = await quizzesAuthContext();

  if ("error" in authContext || !authContext.activeOrganization) {
    redirect("/dashboard/quizzes");
  }

  if (authContext.activeMember?.role !== "member") {
    return (
      <div>
        {/* 
            * In this page,
    
            - Admin: Can see the quiz analytics and users who enrolled, leaderboard
        */}

        <TagList activeOrganizationId={authContext.activeOrganization.id} />
      </div>
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
