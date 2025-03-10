"use client";

import React, { useEffect } from "react";

import { useSidebar } from "@/components/ui/sidebar";
import PageContainer from "@/components/layouts/page-container";
import { UpdateMaterialEditor } from "@/features/materials/components/update-material-editor";
import { useMaterialsGridFilters } from "@/features/materials/components/materials-grid/use-materials-grid-filters";

export default function UpdateMaterialPage() {
  const { state, toggleSidebar } = useSidebar();
  const { updateId } = useMaterialsGridFilters();

  // Collape the sidebar when the page is loaded
  useEffect(() => {
    state === "expanded" && toggleSidebar();
  }, []);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Update Material #{updateId}
          </h1>
        </div>

        <UpdateMaterialEditor />
      </div>
    </PageContainer>
  );
}
