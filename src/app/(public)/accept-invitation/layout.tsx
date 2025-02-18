import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/app-logo";
import SigninForm from "@/features/auth/components/signin-form";

type Props = {
  children: React.ReactNode;
};

export default async function AcceptInviteLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Card className="sm:max-w-[450px] max-w-[350px] mx-auto dark:bg-secondary/10">
      <CardHeader className="flex flex-col items-center">
        <Logo className="mb-4" />

        <CardTitle className="font-heading">Accept Class Invitation</CardTitle>
        <CardDescription>You are invited to a new class</CardDescription>
      </CardHeader>

      <CardContent>
        {session ? children : <SigninForm invitationPage />}
      </CardContent>
    </Card>
  );
}
