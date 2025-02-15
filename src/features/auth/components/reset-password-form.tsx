"use client";

import React, { useId, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  resetPasswordSchema,
  type ResetPasswordSchemaT,
} from "../schema/reset-password-schema";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { authClient } from "../auth-client";
import { PasswordInput } from "@/components/ui/password-input";

type Props = {
  className?: string;
  token?: string;
};

export function ResetPasswordForm({ className, token }: Props) {
  const [isPending, startResetAction] = useTransition();
  const toastId = useId();
  const router = useRouter();

  const form = useForm<ResetPasswordSchemaT>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  function handleFormSubmit(formData: ResetPasswordSchemaT) {
    startResetAction(async () => {
      await authClient.resetPassword(
        {
          newPassword: formData.newPassword,
          token: token,
        },
        {
          onRequest: () => {
            toast.loading("Changing Password...", { id: toastId });
          },
          onSuccess: () => {
            toast.success("Password changed successfully !", { id: toastId });
            router.push("/signin");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message, { id: toastId });
          },
        }
      );
    });
  }

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    placeholder="***********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    placeholder="***********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" loading={isPending}>
            Change Password
          </Button>
        </form>
      </Form>

      {/* Option texts */}
      <div className="flex items-center text-center justify-center">
        <Button asChild variant={"link"} className="p-0">
          <Link href={"/signup"}>Need an account ? Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
