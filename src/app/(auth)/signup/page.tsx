import React from "react";

import { Logo } from "@/components/app-logo";
import { SignupForm } from "@/features/auth/components/signup-form";

interface Props {}

export default function SignupPage({}: Props) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <Logo />
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Get Started !
        </h1>
        <p className="text-base text-muted-foreground">
          Create your new account
        </p>
      </div>
      <div className="max-w-xl w-[350px] mx-auto pb-10">
        <SignupForm />
      </div>
    </div>
  );
}
