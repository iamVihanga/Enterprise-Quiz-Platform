import React from "react";
import { materialsAuthContext } from "@/features/materials/materials-auth-context";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewMaterialTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const header_url = headersList.get("x-current-path") || "";

  if (header_url === "/dashboard/materials/new") {
    const authContext = await materialsAuthContext();

    if ("error" in authContext || !authContext.permissions?.create) {
      return redirect("/dashboard/materials");
    }
  }

  return children;
}
