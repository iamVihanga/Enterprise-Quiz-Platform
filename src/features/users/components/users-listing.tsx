"use client";

import React from "react";

import { columns } from "./users-table/columns";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useUsersTableFilters } from "./users-table/use-users-table-filters";
import DataTableError from "@/components/table/data-table-error";
import { useGetUsers } from "../api/use-get-users";

export default function StudentsListing() {
  const { page, limit, searchQuery } = useUsersTableFilters();

  const { data, error, isPending } = useGetUsers({
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
      data={data.users}
      totalItems={data.total || data.users.length}
    />
  );
}
