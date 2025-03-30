"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { authClient } from "@/features/auth/auth-client";
import { InsertTag, insertTagSchema } from "../schema/zod-schema";
import { useCreateTag } from "../api/use-create-tag";

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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function AddNewTag() {
  const [open, setOpen] = useState<boolean>(false);
  const activeOrg = authClient.useActiveOrganization();
  const { mutate, isPending } = useCreateTag();

  const form = useForm<InsertTag>({
    resolver: zodResolver(insertTagSchema),
    defaultValues: {
      name: "",
      organizationId: "",
    },
  });

  useEffect(() => {
    if (activeOrg.data) {
      form.setValue("organizationId", activeOrg.data.id);
    }
  }, [activeOrg]);

  const handleFormSubmit = (values: InsertTag) => {
    mutate(values, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button icon={<PlusIcon />}>Add new Tag</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new Tag</DialogTitle>
              <DialogDescription>
                Fill the following form to create a new tag
              </DialogDescription>
            </DialogHeader>

            <div className="">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <Input placeholder="Enter name for tag" {...field} />
                    </FormControl>
                    <FormDescription />
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
                onClick={form.handleSubmit(handleFormSubmit)}
                icon={<PlusIcon />}
                loading={isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
