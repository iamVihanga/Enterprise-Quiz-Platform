"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  addMaterialSchema,
  type AddMaterialSchema,
} from "@/features/materials/schemas/zod-material-schema";
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
import { useMaterialsGridFilters } from "./materials-grid/use-materials-grid-filters";
import { useGetMaterial } from "../api/use-get-material-by-id";
import { useUpdateMaterial } from "../api/use-update-material";

export function UpdateMaterialEditor() {
  const { lessonId } = useLessonsGridFilters();
  const { updateId } = useMaterialsGridFilters();

  const {
    data: currentMaterial,
    isPending: isFetching,
    error: fetchErr,
  } = useGetMaterial({
    materialId: updateId,
  });

  const { mutate, isPending } = useUpdateMaterial();
  const router = useRouter();

  const form = useForm<AddMaterialSchema>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      name: "",
      description: "",
      content: `{"type": "doc", "content": []}`,
      thumbnail: "",
      lessonId,
    },
  });

  // Listen to fetch material id and update form value
  useEffect(() => {
    if (!fetchErr && currentMaterial) {
      // Make sure content is valid JSON or use a default
      const validContent = currentMaterial?.content || "{}";

      form.reset({
        name: currentMaterial.name,
        description: currentMaterial?.description || undefined,
        content: validContent,
        lessonId: currentMaterial.lessonId.toString(),
      });
    }
  }, [currentMaterial, fetchErr]);

  const handleUpdateMaterial = (values: AddMaterialSchema) => {
    mutate(
      { id: updateId, values },
      {
        onSuccess: () => {
          form.reset();
          router.push(`/dashboard/materials?active_lesson=${lessonId}`);
        },
      }
    );
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateMaterial)}>
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
                        disabled={isFetching}
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
                        disabled={isFetching}
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
            {/* {currentMaterial?.content} */}
            <NovelEditor
              value={form.watch("content") || "{}"}
              onChange={(value) => form.setValue("content", value)}
            />
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button icon={<EditIcon className="size-4" />} loading={isPending}>
              Update Lesson Material
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
