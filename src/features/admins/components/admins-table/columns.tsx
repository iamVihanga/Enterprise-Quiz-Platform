"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type SelectOrganization } from "@/features/auth/schema/auth-schema";
import Image from "next/image";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Admin = {
  id: string;
  userId: string | undefined;
  name: string | undefined;
  email: string | undefined;
  image: string | null | undefined;
  role: string;
  createdAt: string;
};

export const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      if (row.original.image) {
        return (
          <div className="flex items-center gap-3">
            <Image
              alt={`${row.original.name}`}
              src={row.original.image}
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
              {row.original?.name?.slice(0, 2)}
            </div>
            <p>{row.original.name}</p>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "email",
    header: "Email",
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
