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
import { Input } from "@/components/ui/input";

import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaT,
} from "@/features/auth/schema/forgot-password-schema";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { authClient } from "../auth-client";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  className?: string;
};

export function ForgotPasswordForm({ className }: Props) {
  const [isPending, startAction] = useTransition();
  const toastId = useId();
  const router = useRouter();

  const form = useForm<ForgotPasswordSchemaT>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleFormSubmit(formData: ForgotPasswordSchemaT) {
    startAction(async () => {
      await authClient.forgetPassword(
        {
          email: formData.email,
          redirectTo: "/reset-password",
        },
        {
          onRequest: () => {
            toast.loading("Sending reset link...", { id: toastId });
          },
          onSuccess: () => {
            toast.success("Reset link sent successfully !", { id: toastId });
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" loading={isPending}>
            Send Reset Link
            {!isPending && <ArrowRight className="size-4" />}
          </Button>
        </form>
      </Form>

      {/* Option texts */}
      <div className="flex items-center text-center justify-between">
        <Button
          asChild
          variant={"secondary"}
          className="p-0 px-3 underline"
          icon={<ArrowLeft className="size-4" />}
        >
          <Link href={"/signin"}>Go back</Link>
        </Button>
        <Button asChild variant={"link"} className="p-0">
          <Link href={"/signup"}>Need an account ? Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
