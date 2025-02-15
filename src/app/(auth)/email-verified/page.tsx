import React from "react";

import { Logo } from "@/components/app-logo";
import { ArrowLeft, ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

export default function EmailVerifiedPage({}: Props) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <Logo />
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Great news!
        </h1>
      </div>

      <div className="max-w-xl w-[350px] mx-auto pt-8">
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="p-3 rounded-full bg-green-500/20">
            <CheckCircleIcon className="size-8 text-green-500" />
          </div>

          <p className="text-lg text-center">
            Your email has been verified. You can now sign in to your account.
          </p>

          <Button asChild className="mt-3">
            <Link href={"/"}>
              <ArrowLeftIcon className="size-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
