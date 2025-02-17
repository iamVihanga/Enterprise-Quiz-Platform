"use client";

import React from "react";

import { columns } from "./students-table/columns";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useStudentsTableFilters } from "./students-table/use-students-table-filters";
import DataTableError from "@/components/table/data-table-error";
import { useGetStudents } from "../api/use-get-student";

export default function StudentsListing() {
  const { page, limit, searchQuery } = useStudentsTableFilters();

  const { data, error, isPending } = useGetStudents({
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
      data={data.data}
      totalItems={data.pagination.total}
    />
  );
}
