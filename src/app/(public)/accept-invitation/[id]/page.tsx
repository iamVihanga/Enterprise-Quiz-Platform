"use client";

import React, { useState, useEffect, useId } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader, Shield, XIcon } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/features/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function AcceptInvitePage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const acceptToastId = useId();
  const rejectToastId = useId();

  useEffect(() => {
    if (!params.id) return;

    authClient.organization.getInvitation(
      {
        query: { id: params.id },
      },
      {
        onRequest() {
          setLoading(true);
        },
        onSuccess({ data }) {
          setInvitation(data);
          setLoading(false);
        },
        onError({ error }) {
          setError(error.message);
          setLoading(false);
        },
      }
    );
  }, [params]);

  // Functions
  const handleAcceptInvitation = async () => {
    await authClient.organization.acceptInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onRequest() {
          toast.loading("Accepting invitation...", { id: acceptToastId });
        },
        onSuccess() {
          toast.success("Invitation accepted successfully", {
            id: acceptToastId,
          });
          router.push("/dashboard");
        },
        onError({ error }) {
          toast.error(error.message, { id: acceptToastId });
        },
      }
    );
  };

  const handleRejectInvitation = async () => {
    await authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onRequest() {
          toast.loading("Rejecting invitation...", { id: acceptToastId });
        },
        onSuccess() {
          toast.success("Invitation rejected successfully", {
            id: acceptToastId,
          });
          router.push("/dashboard");
        },
        onError({ error }) {
          toast.error(error.message, { id: acceptToastId });
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader className="text-center size-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center space-y-3">
        <div className="p-3 w-fit bg-red-500/10 text-red-500 rounded-full">
          <XIcon className="size-12 text-red-500" />
        </div>

        <div className="space-y-2 flex flex-col items-center justify-center">
          <div className="text-base text-center">{error}</div>
          <Button asChild variant={"ghost"}>
            <Link href="/dashboard" className="underline">
              <ArrowLeft className="size-3" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-center flex-col gap-3">
      <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-lg text-primary-foreground">
        {invitation?.role !== "admin" ? (
          invitation?.organizationName?.slice(0, 2)
        ) : (
          <Shield className="size-6" />
        )}
      </div>

      {invitation?.role === "admin" && (
        <Badge className="bg-green-500/10 border border-green-500 hover:bg-green-500/10 text-green-500 px-2">
          Class Admin Invitation
        </Badge>
      )}

      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold">
          {invitation?.organizationName}
        </h1>
        <p className="text-xs text-foreground/60">
          {" "}
          Invite Expires in:{" "}
          {invitation?.expiresAt &&
            new Date(invitation?.expiresAt).toLocaleString()}
        </p>
      </div>

      <Separator className="mt-3 mb-1" />

      <div className="w-full flex items-center gap-3">
        <Button
          onClick={handleRejectInvitation}
          className="flex-1"
          variant={"outline"}
        >
          Reject
        </Button>
        <Button
          onClick={handleAcceptInvitation}
          className="flex-1"
          variant={"default"}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
