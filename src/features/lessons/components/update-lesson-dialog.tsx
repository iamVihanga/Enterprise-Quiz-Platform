"use client";

import React, { useEffect, useState, useTransition } from "react";
import { EditIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addLessonSchema,
  type AddLessonSchema,
} from "@/features/lessons/schemas/zod-lesson-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploader } from "@/modules/media/components/MediaUploader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaUploadPaths } from "@/modules/media/types";
import { useLessonsGridFilters } from "./lessons-grid/use-lessons-grid-filters";
import { authClient } from "@/features/auth/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLesson } from "@/features/lessons/api/use-get-lesson-by-id";
import { useUpdateLesson } from "@/features/lessons/api/use-update-lesson";

type Props = {
  className?: string;
};

export function UpdateLesson({ className }: Props) {
  const { mutate: mutateFetching } = useGetLesson();
  const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateLesson();

  const { updateId, setUpdateId } = useLessonsGridFilters();
  const [open, setOpen] = useState<boolean>(false);
  const [initializing, startInitialization] = useTransition();
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  const form = useForm<AddLessonSchema>({
    resolver: zodResolver(addLessonSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (!open) setUpdateId(null);
  }, [open]);

  useEffect(() => {
    if (updateId) {
      setOpen(true);
      initializeLesson();
    } else {
      setOpen(false);
    }
  }, [updateId]);

  const initializeLesson = () => {
    startInitialization(async () => {
      // Check permissions
      const { data, error } = await authClient.organization.hasPermission({
        permission: {
          lesson: ["update"],
        },
      });

      setHasAccess(data?.success || false);

      // Fetch lesson data
      mutateFetching(
        { id: updateId },
        {
          onSuccess({ data }) {
            form.reset({
              name: data.name,
              description: data?.description || "",
              thumbnail: data?.thumbnail || "",
            });
          },
        }
      );
    });
  };

  const handleCreateLesson = (values: AddLessonSchema) => {
    mutateUpdate(
      { id: updateId, values },
      {
        onSuccess: () => {
          // Close the dialog after successful submission
          setOpen(false);

          // Reset form after submission
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Lesson</DialogTitle>
          <DialogDescription>
            Fill the following form for update lesson.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateLesson)}
              className="px-2"
            >
              {initializing ? (
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Skeleton className="w-40 h-4" />
                    <Skeleton className="w-full h-8" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-40 h-4" />
                    <Skeleton className="w-full h-8" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-40 h-4" />
                    <Skeleton className="w-full h-36" />
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <Skeleton className="w-32 h-9"></Skeleton>
                    <Skeleton className="w-40 h-9"></Skeleton>
                  </div>
                </div>
              ) : !hasAccess ? (
                <div className="flex items-center flex-col w-full h-full flex-1">
                  <div className="space-y-1 text-center">
                    <h2 className="text-lg font-semibold">Permission Denied</h2>
                    <p className="text-sm text-foreground/10">
                      You don't have permission to update lesson.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter lesson title"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write lesson short description"
                              className="resize-none"
                              rows={5}
                              {...field}
                              value={field.value as string}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="thumbnail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail</FormLabel>
                          <FormControl>
                            {field.value ? (
                              <div className="relative">
                                <Button
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => form.setValue("thumbnail", "")}
                                >
                                  <EditIcon className="size-4" />
                                </Button>
                                <Image
                                  src={field.value}
                                  alt="thumbnail"
                                  width={500}
                                  height={250}
                                  className="rounded-md p-0 w-full min-h-40 object-cover"
                                />
                              </div>
                            ) : (
                              <MediaUploader
                                acceptedTypes={["image"]}
                                onUpload={(result) => {
                                  field.onChange(result.url);
                                }}
                                onError={(error) => {
                                  console.log(error.message);
                                }}
                                path={MediaUploadPaths.LESSON_THUMBNAILS}
                              />
                            )}
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button
                      type="submit"
                      icon={<EditIcon className="size-4" />}
                      loading={isUpdating}
                    >
                      Update Lesson
                    </Button>
                  </DialogFooter>
                </>
              )}
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
