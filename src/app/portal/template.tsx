import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Toaster } from "sonner";
import { PortalNavBar } from "@/features/portal/components/nav-bar";

type Props = {
  children: React.ReactNode;
};

export default async function PortalTemplate({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/signin");

  return (
    <>
      <Toaster theme="system" position="top-center" />

      <main>{children}</main>
    </>
  );
}
