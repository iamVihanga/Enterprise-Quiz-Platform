"use client";

import React, { useEffect } from "react";

import { useSidebar } from "@/components/ui/sidebar";
import PageContainer from "@/components/layouts/page-container";

export default function AddNewMaterialPage() {
  const { state, toggleSidebar } = useSidebar();

  // Collape the sidebar when the page is loaded
  useEffect(() => {
    state === "expanded" && toggleSidebar();
  }, []);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <h1 className="text-2xl font-semibold">Add New Material</h1>
      </div>
    </PageContainer>
  );
}
