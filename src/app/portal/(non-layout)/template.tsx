import { PortalNavBar } from "@/features/portal/components/nav-bar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function NonLayoutTemplate({ children }: Props) {
  return (
    <div className="bg-secondary/50 dark:bg-secondary/10 min-h-screen">
      <PortalNavBar />
      {children}
    </div>
  );
}
