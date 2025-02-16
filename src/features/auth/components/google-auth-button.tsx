"use client";

import React, { useId, useTransition } from "react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { authClient } from "../auth-client";
import { toast } from "sonner";

type Props = {
  mode: "login" | "signup";
  className?: string;
};

export function GoogleAuthButton({ mode = "login", className }: Props) {
  const [isPending, startAction] = useTransition();
  const toastId = useId();

  function handleAuth() {
    startAction(async () => {
      toast.loading("Signin with Google...", { id: toastId });

      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Signed in with Google !", { id: toastId });
    });
  }

  return (
    <Button
      className={cn("flex items-center gap-2", className)}
      variant={"outline"}
      icon={<FcGoogle className="size-3" />}
      onClick={handleAuth}
      loading={isPending}
    >
      {mode === "login" ? "Sign in" : "Sign up"} with Google
    </Button>
  );
}
