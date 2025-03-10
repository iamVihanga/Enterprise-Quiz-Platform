"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRightIcon,
  Calendar,
  EditIcon,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { SelectMaterial } from "../schemas/db-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MaterialsAuthContext } from "../materials-auth-context";
import { useDeleteMaterial } from "../api/use-delete-material";

type Props = {
  material: SelectMaterial;
  authContext: MaterialsAuthContext;
};

export default function MaterialCard({ material, authContext }: Props) {
  const router = useRouter();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteMaterial();

  const role = "error" in authContext ? null : authContext.activeMember?.role;
  const permissions = "error" in authContext ? null : authContext.permissions;

  const { createdAt } = material;

  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  const handleDelete = () => {
    deleteMutate({ id: material.id });
  };

  return (
    <Card className="w-full h-fit max-w-sm hover:shadow-md group dark:bg-secondary/10 transition-shadow duration-300">
      <CardHeader className="relative">
        <CardTitle>{material.name}</CardTitle>

        {/* Actions Button */}
        {role !== "member" && (
          <div className="absolute right-2 top-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-background border rounded-full"
                >
                  <MoreHorizontal className="h-4 w-4 text-foreground" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {permissions?.update && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/dashboard/materials/update?update_id=${material.id}&active_lesson=${material.lessonId}`
                      );
                    }}
                  >
                    <EditIcon className="size-4" /> Edit Lesson Material
                  </DropdownMenuItem>
                )}
                {permissions?.delete && (
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer"
                    onClick={handleDelete}
                  >
                    <TrashIcon className="size-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <CardDescription>{material.description?.slice(0, 100)}</CardDescription>
      </CardContent>

      <CardFooter className=" flex justify-between items-center">
        <span className="text-sm text-gray-500 flex items-center gap-2">
          <Calendar className="size-4" /> {formattedDate}
        </span>

        <Button asChild icon={<ArrowUpRightIcon />}>
          <Link href={`/dashboard/materials/${material.id}`}>Open</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
