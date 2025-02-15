import React from "react";

import { Logo } from "@/components/app-logo";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

type Props = {};

export default function ForgotPasswordPage({}: Props) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <Logo />
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Forgot your password ?
        </h1>
        <p className="text-base text-muted-foreground">
          Enter your email to get reset password link
        </p>
      </div>
      <div className="max-w-xl w-[350px] mx-auto">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
