"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";

import {
  addMaterialSchema,
  type AddMaterialSchema,
} from "@/features/materials/schemas/zod-lesson-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { NovelEditor } from "@/features/novel/components/editor";
import { useLessonsGridFilters } from "@/features/lessons/components/lessons-grid/use-lessons-grid-filters";
import { useCreateMaterial } from "../api/use-add-material";
import { useRouter } from "next/navigation";

export function NewMaterialEditor() {
  const { lessonId } = useLessonsGridFilters();
  const { mutate, isPending } = useCreateMaterial();
  const router = useRouter();

  const form = useForm<AddMaterialSchema>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "{}",
      thumbnail: "",
      lessonId,
    },
  });

  // Listen to lesson id and update form value
  useEffect(() => {
    form.setValue("lessonId", lessonId);
  }, [lessonId]);

  const handleCreateMaterial = (values: AddMaterialSchema) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();
        router.push(`/dashboard/materials?active_lesson=${lessonId}`);
      },
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateMaterial)}>
          <CardHeader>
            <CardTitle>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <input
                        placeholder="Lesson material title..."
                        className="text-2xl font-normal w-full outline-none border-none px-5 py-4 rounded-md dark:bg-neutral-900/45 bg-neutral-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardTitle>
            <CardDescription>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <input
                        placeholder="Lesson material description"
                        className="text-sm font-normal w-full outline-none border-none px-5 py-4 rounded-md dark:bg-neutral-900/45 bg-neutral-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <NovelEditor
              value={form.watch("content")}
              onChange={(value) => form.setValue("content", value)}
            />
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              icon={<PlusCircle className="size-4" />}
              loading={isPending}
            >
              Create Lesson Material
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
