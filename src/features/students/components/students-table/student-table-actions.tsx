"use client";
import React from "react";

import { useStudentsTableFilters } from "./use-students-table-filters";
import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { InviteStudent } from "../invite-student";

type Props = {};

export function StudentsTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive,
  } = useStudentsTableFilters();

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>

      <InviteStudent />
    </div>
  );
}
