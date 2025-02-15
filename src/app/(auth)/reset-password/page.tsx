import React from "react";

import { Logo } from "@/components/app-logo";
import { ArrowLeft, ArrowLeftIcon, CheckCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

type SearchParams = Promise<{
  error?: string;
  token?: string;
}>;

type Props = {
  searchParams: SearchParams;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error, token } = await searchParams;

  if (error) {
    return (
      <>
        <div className="flex flex-col space-y-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight font-heading">
            Invalid Reset Link
          </h1>
        </div>

        <div className="max-w-xl w-[350px] mx-auto pt-8">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="p-3 rounded-full bg-red-500/20">
              <XIcon className="size-8 text-red-500" />
            </div>

            <p className="text-lg text-center">
              This password reset link is invalid or expired.
            </p>

            <Button asChild className="mt-3">
              <Link href={"/forgot-password"}>
                <ArrowLeftIcon className="size-4" />
                Get new reset link
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Reset Your Password
        </h1>
        <p className="text-base text-muted-foreground">
          Enter your new password and confirm it
        </p>
      </div>
      <div className="max-w-xl w-[350px] mx-auto">
        <ResetPasswordForm token={token} />
      </div>
    </>
  );
}
