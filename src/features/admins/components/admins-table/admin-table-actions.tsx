"use client";
import React from "react";

import { useAdminsTableFilters } from "./use-admin-table-filters";
import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { InviteAdmin } from "../invite-admin";

type Props = {};

export function AdminsTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive,
  } = useAdminsTableFilters();

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex flex-wrap items-center gap-4">
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

      <InviteAdmin />
    </div>
  );
}
