"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Award,
  Clock,
  EditIcon,
  LayoutGrid,
  MoreHorizontal,
  RefreshCcw,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { QuizzesAuthContext } from "@/features/quizzes/quizzes-auth-context";
import { useDeleteQuiz } from "@/features/quizzes/api/use-delete-quiz";

import { SelectQuiz } from "../schemas/db-schema";

type Props = {
  quiz: SelectQuiz;
  authContext: QuizzesAuthContext;
};

export function QuizCard({ quiz, authContext }: Props) {
  const router = useRouter();

  const role = "error" in authContext ? null : authContext.activeMember?.role;
  const permissions = "error" in authContext ? null : authContext.permissions;

  // const { setUpdateId } = useQuizGridFilters();
  // You would need to add this hook for quiz deletion
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteQuiz();

  const {
    title,
    description,
    thumbnail,
    createdAt,
    timeLimit,
    passingScore,
    isPublished,
  } = quiz;

  // Format the date using date-fns
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  // Format time limit from seconds to minutes/hours
  const formatTimeLimit = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
    }
    return `${minutes}m`;
  };

  const handleDelete = () => {
    deleteMutate({ id: quiz.id.toString() });
  };

  return (
    <Card className="group w-full flex flex-col max-w-sm hover:shadow-md bg-sidebar dark:bg-secondary/10 transition-shadow duration-300">
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
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/dashboard/quizzes/update/${quiz.id}?active_lesson=${quiz.lessonId}`
                      )
                    }
                  >
                    <EditIcon className="size-4 mr-2" /> Edit Quiz
                  </DropdownMenuItem>
                )}
                {permissions?.delete && (
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="aspect-video w-full overflow-hidden rounded-lg relative border border-foreground/10">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <LayoutGrid className="size-12 text-muted-foreground/40" />
            </div>
          )}

          <div className="absolute top-2 left-2">
            <Badge
              variant={isPublished ? "success" : "secondary"}
              // className="bg-background/80"
            >
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-1">
        <Link href={`/dashboard/quizzes/${quiz.id}`}>
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:underline">
            {title}
          </h3>

          {description && (
            <p className="text-sm dark:text-foreground/40 text-foreground/60 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </Link>
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col gap-4">
        <div className="w-full flex items-center justify-between text-xs text-foreground/60 mt-3">
          <Badge variant={"outline"} className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>Duration: {timeLimit && formatTimeLimit(timeLimit)}</span>
          </Badge>

          <div className="flex items-center gap-1">
            <Award className="size-3" />
            <span>Pass: {passingScore}%</span>
          </div>
        </div>

        <div className="w-full items-center flex justify-between text-xs text-foreground/60 pt-0">
          <span>Created {formattedDate}</span>
          <Button variant="secondary" size="sm" className="px-2" asChild>
            <Link href={`/dashboard/quizzes/${quiz.id}`}>
              {isPublished ? "Take" : "Preview"}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
