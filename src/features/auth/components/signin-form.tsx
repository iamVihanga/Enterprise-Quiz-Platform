"use client";

import React, { useId, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";

import { signinSchema, type SigninSchemaT } from "../schema/signin-schema";

import { GoogleAuthButton } from "./google-auth-button";
import { AppleAuthButton } from "./apple-auth-button";
import { authClient } from "../auth-client";
import { toast } from "sonner";

type Props = {
  className?: string;
  invitationPage?: boolean;
};

export default function SigninForm({
  className,
  invitationPage = false,
}: Props) {
  const [isPending, startSigninAction] = useTransition();
  const searchParams = useSearchParams();
  const toastId = useId();
  const router = useRouter();

  const redirectTo = searchParams.get("redirect_to");

  const form = useForm<SigninSchemaT>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleFormSubmit(formData: SigninSchemaT) {
    startSigninAction(async () => {
      await authClient.signIn.email(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onRequest: () => {
            toast.loading("Signing in...", { id: toastId, description: "" });
          },
          onSuccess: () => {
            toast.success("Signed in successfully", {
              id: toastId,
              description: "",
            });

            if (!invitationPage) {
              router.push(redirectTo ? `${redirectTo}` : "/dashboard");
            }

            router.refresh();
          },
          onError: (ctx) => {
            toast.error("Sign in Failed !", {
              id: toastId,
              description: ctx.error.message,
            });
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
            Sign in
          </Button>
        </form>
      </Form>

      {/* Option texts */}
      <div className="flex items-center text-center justify-between">
        <Button asChild variant={"link"} className="p-0">
          <Link href={"/signup"}>Need an account ? Sign Up</Link>
        </Button>
        <Button asChild variant={"link"} className="p-0">
          <Link href={"/forgot-password"}>Forgot Password</Link>
        </Button>
      </div>

      {!invitationPage && (
        <>
          <Separator />

          {/* Auth Provider Buttons */}
          <div className="flex flex-col space-y-4">
            <GoogleAuthButton mode="login" />
            <AppleAuthButton mode="login" />
          </div>
        </>
      )}
    </div>
  );
}
