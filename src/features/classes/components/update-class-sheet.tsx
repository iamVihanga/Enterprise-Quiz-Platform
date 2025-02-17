import React, { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectOrganization } from "@/db/schema";
import { authClient } from "@/features/auth/auth-client";
import { createClassSchema, CreateClassSchema } from "../schema/create-class";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUpdateClass } from "../api/use-update-class";

interface UpdateClassSheetProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateClassId: string;
}

export function UpdateClassSheet({
  open,
  setOpen,
  updateClassId,
}: UpdateClassSheetProps) {
  const { mutate, isPending } = useUpdateClass();
  const [isFetching, startFetching] = useTransition();
  const [currentClass, setCurrentClass] = useState<SelectOrganization | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateClassSchema>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;

    startFetching(async () => {
      if (!updateClassId) return;

      const { data: organization, error } =
        await authClient.organization.getFullOrganization({
          query: { organizationId: updateClassId },
        });

      if (!organization || error) {
        toast.error("Failed to fetch organization data");
        return;
      }

      setCurrentClass({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        logo: organization?.logo || null,
        metadata: organization.metadata,
        createdAt: organization.createdAt,
      });
    });
  }, [open, updateClassId]);

  useEffect(() => {
    if (!currentClass) return;

    form.setValue("name", currentClass.name);

    if (currentClass.metadata) {
      const desc = JSON.parse(currentClass.metadata)?.description || "";
      form.setValue("description", desc);
    }

    if (currentClass.logo) {
      form.setValue("image", currentClass.logo);
    }
  }, [currentClass]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const onSubmit = (values: CreateClassSchema) => {
    mutate(
      { ...values, id: updateClassId },
      {
        onSuccess() {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit class</SheetTitle>
          <SheetDescription>
            Make changes to selected class here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        {/* Update Form */}
        {isFetching ? (
          <div className="grid gap-6 py-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="flex items-center gap-3 w-full">
              <Skeleton className="size-14 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-8 w-40" />
              </div>
            </div>
          </div>
        ) : (
          currentClass && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-5 my-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter class name" />
                        </FormControl>

                        <FormMessage {...field} />
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
                          <Input
                            {...field}
                            placeholder="Class description (Ex: Gampaha)"
                          />
                        </FormControl>

                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                alt="logo"
                                fill
                                className="object-cover"
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm">Class Logo</p>
                            <p className="text-xs text-muted-foreground">
                              {`JPG, PNG, SVG or JPEG (max 1MB)`}
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=".jpg, .png, .jpeg, .svg"
                              ref={inputRef}
                              disabled={isPending}
                              onChange={handleImageChange}
                            />
                            {field.value ? (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"destructive"}
                                size="sm"
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                }}
                                icon={<Upload className="size-3" />}
                              >
                                Remove Image
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant={"default"}
                                size="sm"
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click()}
                                icon={<Upload className="size-3" />}
                              >
                                Upload Image
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
