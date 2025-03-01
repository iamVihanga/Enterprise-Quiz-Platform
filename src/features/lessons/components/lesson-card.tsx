import React from "react";
import { formatDistanceToNow } from "date-fns";
import { EditIcon, MoreHorizontal, TrashIcon } from "lucide-react";

import { SelectLesson } from "../schemas/db-schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteLesson } from "@/features/lessons/api/use-delete-lesson";
import { LessonsAuthContext } from "../lessons-auth-context";

type Props = {
  lesson: SelectLesson;
  authContext: LessonsAuthContext;
};

export function LessonCard({ lesson, authContext }: Props) {
  const role = "error" in authContext ? null : authContext.activeMember?.role;
  const permissions = "error" in authContext ? null : authContext.permissions;

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteLesson();
  const { name, description, thumbnail, createdAt } = lesson;

  // Format the date using date-fns
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  // Generate initials for the avatar fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleDelete = () => {
    deleteMutate({ id: lesson.id });
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-md dark:bg-secondary/10 transition-shadow duration-300">
      <CardHeader className="relative pb-0">
        {role !== "member" && (
          <div className="absolute right-4 top-4 z-10">
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
                  <DropdownMenuItem className="cursor-pointer">
                    <EditIcon className="size-4" /> Edit Lesson
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

        {thumbnail && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={thumbnail}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
        {description && (
          <p className="text-sm dark:text-foreground/40 text-foreground/60 mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between text-xs text-foreground/60 pt-0">
        <span>Created {formattedDate}</span>
        <Button variant="secondary" size="sm" className="px-2">
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
