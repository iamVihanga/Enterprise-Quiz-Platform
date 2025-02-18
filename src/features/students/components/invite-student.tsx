"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, PlusCircle, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import {
  inviteStudentSchema,
  type InviteStudentSchema,
} from "../schemas/invite-student";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { UserWithRole } from "better-auth/plugins";
import { authClient } from "@/features/auth/auth-client";
import { toast } from "sonner";
import { useInviteStudent } from "../api/use-invite-student";

export function InviteStudent() {
  const { mutate } = useInviteStudent();
  const [isSearching, startSearching] = useTransition();
  const [usersList, setUsersList] = useState<UserWithRole[]>([]);
  const [isOpen, setOpen] = useState<boolean>(false);

  const form = useForm<InviteStudentSchema>({
    resolver: zodResolver(inviteStudentSchema),
    defaultValues: {
      email: "",
    },
  });

  const formEmail = form.watch("email");

  useEffect(() => {
    if (formEmail) {
      handleSearch(formEmail);
    }
  }, [formEmail]);

  const handleSearch = (term: string) => {
    startSearching(async () => {
      if (!term) return;

      const { data, error } = await authClient.admin.listUsers({
        query: {
          searchField: "email",
          searchOperator: "contains",
          searchValue: term,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setUsersList(data.users);
    });
  };

  const onSubmit = (values: InviteStudentSchema) => {
    mutate(values, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<PlusCircle className="size-4" />}>Invite Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Invite to new Student</DialogTitle>
          <DialogDescription>
            Join a new student to selected class
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Notice!</AlertTitle>
          <AlertDescription className="mt-3 text-xs text-foreground/70">
            <p>{`You can only invite students who have an account on this platform.`}</p>
            <p>
              <Link
                className="underline text-foreground"
                href="/dashboard/user-management"
              >
                Click here
              </Link>{" "}
              to create new student accounts
            </p>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <div className="flex items-center">
                          <Input {...field} placeholder="Enter email address" />
                          {!isSearching ? (
                            <SearchIcon className="size-4 -ml-7" />
                          ) : (
                            <Loader2 className="size-4 animate-spin -ml-7" />
                          )}
                        </div>

                        {usersList.length > 0 && form.getValues("email") && (
                          <Card className="absolute mt-1 w-full p-0">
                            <CardContent className="p-2 space-y-2">
                              {usersList.map(
                                (user) =>
                                  user.role !== "admin" && (
                                    <div
                                      key={user.id}
                                      className="cursor-pointer flex items-center gap-2 px-2 py-2 bg-secondary/50 rounded-md text-xs"
                                      onClick={() => {
                                        form.setValue("email", user.email);
                                        setUsersList([]);
                                      }}
                                    >
                                      {user.email}
                                    </div>
                                  )
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <Button type="submit">Send Invite</Button>
                    </div>
                  </FormControl>

                  <FormMessage {...field} />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
