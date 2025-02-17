"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { VerifiedIcon, XCircleIcon } from "lucide-react";
import { UserWithRole } from "better-auth/plugins";

import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = UserWithRole;

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      if (row.original.image) {
        return (
          <div className="flex items-center gap-3">
            <Image
              alt={row.original.name}
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
              {row.original.name.slice(0, 2)}
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <Badge variant={"outline"}>{row.original.role}</Badge>,
  },
  {
    accessorKey: "emailVerified",
    header: "Verified",
    cell: ({ row }) => (
      <Badge
        className={
          row.original.emailVerified
            ? "bg-green-500 text-white"
            : "bg-destructive text-destructive-foreground"
        }
      >
        {row.original.emailVerified ? (
          <>
            <VerifiedIcon className="mr-1 size-4" /> Verified
          </>
        ) : (
          <>
            <XCircleIcon className="mr-1 size-4" /> Not Verified
          </>
        )}
      </Badge>
    ),
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.banned) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <div
                    className={
                      "size-2 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500"
                    }
                  />
                  <span className="text-xs hover:underline cursor-pointer">
                    Banned
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.original.banReason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        return (
          <div className="flex items-center gap-2">
            <div
              className={
                "size-2 rounded-full bg-green-500 shadow-lg shadow-green-500"
              }
            />
            <span className="text-xs">Active</span>
          </div>
        );
      }
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
