"use client";

import React, { useEffect, useState, useTransition } from "react";
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
import { authClient } from "@/features/auth/auth-client";
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
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function UpdateLesson({ className, children }: Props) {
  const [checkingAccess, startCheckPermission] = useTransition();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<AddLessonSchema>({
    resolver: zodResolver(addLessonSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: "",
    },
  });

  useEffect(() => {
    handleCheckPermission();
  }, []);

  const handleCheckPermission = () => {
    startCheckPermission(async () => {
      const { data, error } = await authClient.organization.hasPermission({
        permission: {
          lesson: ["update"],
        },
      });

      setHasAccess(data?.success || false);
    });
  };

  const handleCreateLesson = (values: AddLessonSchema) => {
    // mutate(values, {
    //   onSuccess: () => {
    //     // Close the dialog after successful submission
    //     setOpen(false);
    //     // Reset form after submission
    //     form.reset();
    //   },
    // });

    console.log(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              <div className="grid gap-4 py-4"></div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
