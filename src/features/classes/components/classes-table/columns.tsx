"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type SelectOrganization } from "@/features/auth/schema/auth-schema";
import Image from "next/image";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Classes = Omit<SelectOrganization, "createdAt"> & {
  createdAt: string;
};

export const columns: ColumnDef<Classes>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      if (row.original.logo) {
        return (
          <div className="flex items-center gap-3">
            <Image
              alt={row.original.name}
              src={row.original.logo}
              width={50}
              height={50}
              className="size-8 rounded-md object-cover"
            />

            <p>{row.original.name}</p>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center text-sm text-primary-foreground">
              {row.original.name.slice(0, 2)}
            </div>
            <p>{row.original.name}</p>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "metadata",
    header: "Description",
    cell: ({ row }) => {
      if (row.original.metadata) {
        return JSON.parse(row.original.metadata)?.description || "-";
      } else return "-";
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
