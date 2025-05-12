"use client";

import React, { useId } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/features/auth/auth-client";
import { Card } from "@/components/ui/card";
import { ChevronsUpDown, GraduationCap } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ClassSwitcherProps {
  dropdownSide?: "right" | "top" | "bottom";
  refetch?: boolean;
}

export function PortalClassSwitcher({
  dropdownSide = "right",
  refetch = false
}: ClassSwitcherProps) {
  const toastId = useId();
  const router = useRouter();

  // Get active class
  const { data: activeClass, isPending: isPendingActiveClass } =
    authClient.useActiveOrganization();

  // Get all classes
  const { data: allClasses, isPending: isPendingAllClasses } =
    authClient.useListOrganizations();

  const handleSetActiveClass = async (id: string) => {
    await authClient.organization.setActive(
      {
        organizationId: id
      },
      {
        onRequest() {
          toast.loading("Switching class...", { id: toastId });
        },
        onSuccess() {
          toast.success("Switched to class successfully!", { id: toastId });

          refetch && router.refresh();
        },
        onError({ error }) {
          toast.error(error.message || "Failed to switch class", {
            id: toastId
          });
        }
      }
    );
  };

  const renderActiveClassContent = () => {
    if (isPendingActiveClass) {
      return (
        <Card className="flex w-full items-center gap-2 p-2 py-3 border">
          <Skeleton className="aspect-square size-8 rounded-lg" />
          <div className="grid flex-1 gap-1">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
          <Skeleton className="size-4" />
        </Card>
      );
    }

    if (!activeClass) {
      return (
        <Card className="flex w-full items-center gap-2 p-2 py-3 border">
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Select a class</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Card>
      );
    }

    return (
      <Card className="flex w-full items-center gap-2 p-2 py-3 border dark:bg-secondary/3">
        {activeClass?.logo ? (
          <Image
            alt={activeClass.name}
            src={activeClass.logo}
            width={50}
            height={50}
            className="flex aspect-square size-8 rounded-lg object-cover"
          />
        ) : (
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {activeClass?.name.slice(0, 2)}
          </div>
        )}

        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{activeClass?.name}</span>
          <span className="truncate text-xs text-foreground/60">
            {activeClass?.metadata &&
              JSON.parse(activeClass?.metadata)?.description}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </Card>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderActiveClassContent()}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side={dropdownSide}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Classes
        </DropdownMenuLabel>
        {!isPendingAllClasses && allClasses ? (
          allClasses.map((classI) => (
            <DropdownMenuItem
              key={classI.id}
              onClick={() => handleSetActiveClass(classI.id)}
              className="gap-2 p-2"
            >
              {classI?.logo ? (
                <Image
                  alt={classI.name}
                  src={classI.logo}
                  width={50}
                  height={50}
                  className="flex aspect-square size-6 rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {classI?.name.slice(0, 2)}
                </div>
              )}
              {classI.name}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="space-y-2">
            {Array(5)
              .fill("_")
              .map((_, index) => (
                <div key={index} className="flex w-full items-center gap-2 p-2">
                  <Skeleton className="aspect-square size-6 rounded-lg" />
                  <div className="grid flex-1 gap-1">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                </div>
              ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
