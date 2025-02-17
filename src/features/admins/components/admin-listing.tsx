"use client";

import React from "react";

import { columns } from "./admins-table/columns";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useAdminsTableFilters } from "./admins-table/use-admin-table-filters";
import DataTableError from "@/components/table/data-table-error";
import { useGetAdmins } from "../api/use-get-admins";

export default function AdminsListing() {
  const { page, limit, searchQuery } = useAdminsTableFilters();

  const { data, error, isPending } = useGetAdmins({
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
