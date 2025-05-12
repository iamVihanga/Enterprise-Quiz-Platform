"use client";
import React from "react";
import { CalendarIcon, Mail, UserIcon } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/features/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

export function ProfileCard({}: Props) {
  const { data, error, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 py-3">
          <CardTitle className="text-sm text-foreground/60 flex items-center gap-2">
            <UserIcon size={16} className="text-primary" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-2">
        <CardContent className="py-4">
          <p className="text-destructive">Error loading profile</p>
        </CardContent>
      </Card>
    );
  }

  const { user } = data;
  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
  const joinDate = new Date(user.createdAt);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 py-3">
        <CardTitle className="text-sm text-foreground/60 flex items-center gap-2">
          <UserIcon size={16} className="text-primary" />
          User Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4 dark:bg-secondary/30">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="text-lg bg-primary/10">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-medium text-base">{user.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarIcon size={14} />
              <span>Joined</span>
            </span>
            <span className="text-sm">{format(joinDate, "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
