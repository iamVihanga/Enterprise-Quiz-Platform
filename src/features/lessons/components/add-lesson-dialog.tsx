"use client";

import React, { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  DialogTrigger,
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

import { useCreateLesson } from "@/features/lessons/api/use-add-lesson";

type Props = {
  className?: string;
};

export function AddLessonDialog({ className }: Props) {
  const { mutate, isPending } = useCreateLesson();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<AddLessonSchema>({
    resolver: zodResolver(addLessonSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: "",
    },
  });

  const handleCreateLesson = (values: AddLessonSchema) => {
    mutate(values, {
      onSuccess: () => {
        // Close the dialog after successful submission
        setOpen(false);
        // Reset form after submission
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(className)}
          icon={<PlusCircleIcon className="size-4" />}
        >
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add new Lesson</DialogTitle>
          <DialogDescription>
            Fill the following form for add a new lesson.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateLesson)}
              className="px-2"
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter lesson title" />
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
                      </FormControl>
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
                  icon={<PlusCircleIcon className="size-4" />}
                  loading={isPending}
                >
                  Create Lesson
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
