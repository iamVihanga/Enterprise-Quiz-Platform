"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SelectTag } from "@/features/tags/schema/zod-schema";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<SelectTag>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-primary flex items-center justify-center text-sm text-primary-foreground">
            {row.original?.name?.slice(0, 2)}
          </div>
          <p>{row.original.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
