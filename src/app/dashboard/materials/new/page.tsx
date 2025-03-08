"use client";

import React, { useEffect } from "react";

import { useSidebar } from "@/components/ui/sidebar";
import PageContainer from "@/components/layouts/page-container";
import { NewMaterialEditor } from "@/features/materials/components/new-material-editor";
import LessonSelector from "@/features/lessons/components/lesson-selector";

export default function AddNewMaterialPage() {
  const { state, toggleSidebar } = useSidebar();

  // Collape the sidebar when the page is loaded
  useEffect(() => {
    state === "expanded" && toggleSidebar();
  }, []);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Add New Material</h1>
          <LessonSelector />
        </div>

        <NewMaterialEditor />
      </div>
    </PageContainer>
  );
}
