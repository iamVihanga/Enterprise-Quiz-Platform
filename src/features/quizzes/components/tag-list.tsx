"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2Icon,
  PlusCircleIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useGetQuizzes } from "@/features/quizzes/api/use-get-tags";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  InsertTag,
  insertTagSchema,
  SelectTag,
} from "@/features/tags/schema/zod-schema";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useGetTags } from "@/features/tags/api/use-get-tags";
import { useCreateTag } from "@/features/tags/api/use-create-tag";
import { useAddTag } from "@/features/quizzes/api/use-add-tag";
import { useRemoveTag } from "../api/use-remove-tag";
import { authClient } from "@/features/auth/auth-client";

type Props = {
  className?: string;
  activeOrganizationId?: string;
};

interface AddTagDialogInterface {
  open?: boolean;
  setOpen?: (state: boolean) => void;
  quizId?: string;
  activeOrganizationId?: string;
}

function AddTagDialog({
  open,
  setOpen,
  quizId,
  activeOrganizationId,
}: AddTagDialogInterface) {
  const { mutate: mutateCreate, isPending: creating } = useCreateTag();
  const {
    data: tags,
    error: tagsError,
    isPending,
  } = useGetTags({ page: 1, limit: 100 });

  const { data: quizTags } = useGetQuizzes({
    quizId: quizId as string,
  });

  let quizTagsIds: number[] = [];
  if (quizTags) {
    quizTagsIds = quizTags.map((tag) => tag.tag.id);
  }

  const isTagAlreadyAdded = (tagId: number) => {
    if (!quizTagsIds) return false;

    return quizTagsIds.includes(tagId);
  };

  const { mutate: mutateAdd } = useAddTag();

  const form = useForm<InsertTag>({
    resolver: zodResolver(insertTagSchema),
    defaultValues: {
      name: "",
      organizationId: "",
    },
  });

  useEffect(() => {
    if (!activeOrganizationId) return;

    form.setValue("organizationId", activeOrganizationId);
  }, [activeOrganizationId]);

  const handleCreateTag = async (values: InsertTag) => {
    if (!quizId) return;

    const { data: session, error: sessionError } =
      await authClient.getSession();

    if (sessionError) return;

    const activeOrganization = session?.session.activeOrganizationId;

    if (!activeOrganization) return;

    mutateCreate(
      {
        name: values.name,
        organizationId: activeOrganization,
      },
      {
        onSuccess: async (res) => {
          const data = await res.json();

          if ("error" in data) return;

          mutateAdd({ quizId: parseInt(quizId), tagId: data.data.id });
        },
      }
    );
  };

  const handleAddTag = (tagId: number) => {
    if (!quizId || !tagId) return;

    mutateAdd({ quizId: parseInt(quizId), tagId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={"max-h-[70vh]"}>
        <DialogHeader>
          <DialogTitle>Add new Tag</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-2">
          {/* Create tag */}
          <Form {...form}>
            <form
              className="flex items-center gap-2"
              onSubmit={form.handleSubmit(handleCreateTag)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Create new tag for quiz..."
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-10"
                variant={"outline"}
                disabled={!form.getValues("name") || creating}
                icon={<PlusCircleIcon />}
                loading={creating}
              >
                Create
              </Button>
            </form>
          </Form>

          <Separator />

          <ScrollArea className="mt-2 h-[250px]">
            {isPending && (
              <div className="space-y-2">
                {Array(10)
                  .fill("_")
                  .map((item, index) => (
                    <Skeleton key={index} className="h-12 rounded-md w-full" />
                  ))}
              </div>
            )}

            {!isPending && tagsError && (
              <Alert className="bg-sidebar">
                <PlusCircleIcon className="h-4 w-4" />
                <AlertTitle>Failed to fetch tags</AlertTitle>
                <AlertDescription className="mt-1 text-secondary-foreground/70">
                  {tagsError.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              {!isPending &&
                tags &&
                tags.data.map((tag, index) => {
                  return (
                    <Card key={index} className="p-0">
                      <CardContent className="py-2 px-3 flex items-center justify-between">
                        <p>{tag.name}</p>

                        {isTagAlreadyAdded(tag.id) ? (
                          <Button
                            size="sm"
                            variant={"secondary"}
                            disabled={true}
                            icon={<CheckCircle2Icon />}
                          >
                            Added
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            icon={<PlusIcon />}
                            onClick={() => handleAddTag(tag.id)}
                          >
                            Add
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => setOpen && setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TagList({ className, activeOrganizationId }: Props) {
  const [addTagModalOpen, setAddTagModalOpen] = useState<boolean>(false);
  const { id: quizId } = useParams();

  const { mutate: mutateRemove } = useRemoveTag();

  if (!quizId) return null;

  const { data, error, isPending } = useGetQuizzes({
    quizId: quizId as string,
  });

  const handleRemoveTag = (tagId: number) => {
    if (!quizId || !tagId) return;

    mutateRemove({ quizId: parseInt(quizId as string), tagId });
  };

  return (
    <>
      {/* Add new tag modal */}
      <AddTagDialog
        open={addTagModalOpen}
        setOpen={setAddTagModalOpen}
        quizId={quizId as string}
        activeOrganizationId={activeOrganizationId}
      />

      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Quiz Tags</CardTitle>
          <CardDescription>
            Quiz tags are helpful for users to filter quizzes by their interests
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          {isPending &&
            Array(10)
              .fill("_")
              .map((item, index) => (
                <Skeleton key={index} className="h-5 rounded-full w-20" />
              ))}

          {!isPending && data && data.length < 1 ? (
            <Alert className="bg-sidebar">
              <PlusCircleIcon className="h-4 w-4" />
              <AlertTitle>No tags are added</AlertTitle>
              <AlertDescription className="mt-1 text-secondary-foreground/70">
                Create new tags for quiz to improve user suggestions
              </AlertDescription>
            </Alert>
          ) : (
            data &&
            data.map((item, index) => (
              <Badge
                key={index}
                variant={"outline"}
                className={cn(
                  "group border border-dashed flex items-center gap-2 cursor-default"
                )}
              >
                <p>{item.tag.name}</p>

                <div
                  className="p-0.5 hidden group-hover:flex rounded-full bg-destructive cursor-pointer"
                  onClick={() => handleRemoveTag(item.tag.id)}
                >
                  <XIcon className="text-destructive-foreground size-3" />
                </div>
              </Badge>
            ))
          )}

          {!isPending && error && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Failed to fetch tags</h2>
              <p className="text-sm text-foreground/700">{error.message}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            icon={<PlusIcon />}
            onClick={() => {
              setAddTagModalOpen(true);
            }}
          >
            Add new Tag
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
