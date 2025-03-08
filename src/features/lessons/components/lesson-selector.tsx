"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown, Loader } from "lucide-react";
import { toast } from "sonner";

import { useGetLessons } from "@/features/lessons/api/use-get-lessons";
import { useLessonsGridFilters } from "@/features/lessons/components/lessons-grid/use-lessons-grid-filters";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SelectLesson } from "../schemas/db-schema";
import { useGetLesson } from "../api/use-get-lesson-by-id";
import { useRouter } from "next/navigation";

interface LessonSelectorProps {
  fullWidth?: boolean;
}

export default function LessonSelector({
  fullWidth = false,
}: LessonSelectorProps) {
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [lessonSearch, setLessonSearch] = useState<string>("");
  const [activeLesson, setActiveLesson] = useState<SelectLesson | null>(null);
  const router = useRouter();

  const { lessonId, setLessonId } = useLessonsGridFilters();

  const { data, error, isPending } = useGetLessons({
    limit,
    page,
    search: lessonSearch,
  });

  const { mutate: getActiveLesson, isPending: gettingActiveLesson } =
    useGetLesson();

  useEffect(() => {
    if (lessonId) {
      getActiveLesson(
        { id: lessonId },
        {
          onSuccess(data: any) {
            setActiveLesson(data.data);
            router.refresh();
          },
          onError() {
            toast.error("Failed to fetch selected lesson");
          },
        }
      );
    } else {
      setActiveLesson(null);
    }
  }, [lessonId]);

  return (
    <div>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={activeLesson ? "secondary" : "outline"}
                  loading={gettingActiveLesson}
                  disabled={gettingActiveLesson}
                  icon={<ChevronsUpDown className="size-3" />}
                  className="justify-start"
                >
                  <span className={`${fullWidth ? "" : "max-w-44"}  truncate`}>
                    {activeLesson
                      ? `Lesson: ${activeLesson.name}`
                      : "No Lesson Selected"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {activeLesson && (
              <TooltipContent>
                <p>{`Lesson: ${activeLesson.name}`}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent>
          <DropdownMenuLabel>All Lessons</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Input
            placeholder="Search lesson"
            value={lessonSearch}
            onChange={(e) => setLessonSearch(e.target.value)}
          />
          <div className="mt-2 space-y-2">
            {isPending ? (
              <div className="w-full h-32 flex items-center justify-center">
                <Loader className="animate-spin size-4" />
              </div>
            ) : data ? (
              data.data.map((item) => (
                <DropdownMenuItem
                  className="bg-muted/20 cursor-pointer opacity-60 hover:opacity-100"
                  key={item.id}
                  onClick={() => setLessonId(item.id.toString())}
                >
                  {item.name}
                </DropdownMenuItem>
              ))
            ) : (
              error && (
                <DropdownMenuLabel>Failed to fetch lessons</DropdownMenuLabel>
              )
            )}
          </div>

          <DropdownMenuSeparator />

          <div className="flex items-center justify-end">
            <Button
              disabled={data ? data.pagination.total <= limit : true}
              onClick={() => {
                setPage(page + 1);
                setLimit(limit + 10);
              }}
              size="sm"
              variant={"outline"}
            >
              Next
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
