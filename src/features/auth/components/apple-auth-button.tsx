import React, { useId, useTransition } from "react";
import { FaApple } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { authClient } from "../auth-client";

type Props = {
  mode: "login" | "signup";
  className?: string;
};

export function AppleAuthButton({ mode = "login", className }: Props) {
  const [isPending, startAction] = useTransition();
  const toastId = useId();

  function handleAuth() {
    startAction(async () => {
      toast.loading("Signin with Apple...", { id: toastId });

      const { data, error } = await authClient.signIn.social({
        provider: "apple",
      });

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success("Signed in with Apple !", { id: toastId });
    });
  }

  return (
    <Button
      className={cn("flex items-center gap-2", className)}
      variant={"outline"}
      icon={<FaApple className="size-3" />}
      onClick={handleAuth}
      loading={isPending}
    >
      {mode === "login" ? "Sign in" : "Sign up"} with Apple
    </Button>
  );
}
