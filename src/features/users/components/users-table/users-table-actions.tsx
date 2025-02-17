"use client";
import React from "react";

import { useUsersTableFilters } from "./use-users-table-filters";
import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";

type Props = {};

export function UsersTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive,
  } = useUsersTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="email"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
