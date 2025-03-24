import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { quizzesAuthContext } from "@/features/quizzes/quizzes-auth-context";

export default async function NewMaterialTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const header_url = headersList.get("x-current-path") || "";

  if (
    header_url === "/dashboard/quizzes/new" ||
    header_url.includes("/dashboard/quizzes/update") ||
    header_url.includes("/dashboard/quizzes/%5Bid%5D/questions")
  ) {
    const authContext = await quizzesAuthContext();

    if ("error" in authContext) {
      return redirect("/dashboard/quizzes");
    }

    // Check is user has permission to create quiz and validate create quiz route
    if (
      header_url === "/dashboard/quizzes/new" &&
      header_url.includes("/dashboard/quizzes/%5Bid%5D/questions") &&
      !authContext.permissions?.create
    ) {
      return redirect("/dashboard/quizzes");
    }

    if (
      header_url.includes("/dashboard/quizzes/update") &&
      !authContext.permissions?.update
    ) {
      return redirect("/dashboard/quizzes");
    }
  }

  return children;
}
