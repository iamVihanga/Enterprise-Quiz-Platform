"use client";

import React, { useId, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, type VariantType } from "@/components/ui/button";
import { authClient } from "../auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

type Props = {
  className?: string;
  variant?: VariantType;
};

export function SignoutButton({ className, variant }: Props) {
  const [isSigningOut, startSignout] = useTransition();
  const router = useRouter();
  const toastId = useId();

  const handleSignout = () => {
    startSignout(async () => {
      await authClient.signOut({
        fetchOptions: {
          onRequest: () => {
            toast.loading("Signing out...", { id: toastId });
          },
          onSuccess: () => {
            toast.success("Signed out !", { id: toastId });
            router.push("/signin");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message, { id: toastId });
          },
        },
      });
    });
  };

  return (
    <Button
      loading={isSigningOut}
      onClick={handleSignout}
      className={cn("", className)}
      variant={variant ?? "default"}
      icon={<LogOut />}
    >
      Sign out
    </Button>
  );
}
