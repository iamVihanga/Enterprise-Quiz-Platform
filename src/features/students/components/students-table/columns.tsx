"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type SelectOrganization } from "@/features/auth/schema/auth-schema";
import Image from "next/image";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Student = {};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    // cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
