"use client";

import React from "react";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { columns } from "./tags-table/columns";
import { useTagsTableFilters } from "./tags-table/use-tag-table-filters";
import { useGetTags } from "../api/use-get-tags";

export default function TagsListing() {
  const { page, limit, searchQuery } = useTagsTableFilters();

  const { data, error, isPending } = useGetTags({
    limit,
    page,
    search: searchQuery,
  });

  if (isPending) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DataTable
      columns={columns}
      data={data.data as any}
      totalItems={data.pagination.total}
    />
  );
}
