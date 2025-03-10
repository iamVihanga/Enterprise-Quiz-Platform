"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, BookCopy } from "lucide-react";

import { useGetMaterials } from "../api/use-get-materials";
import { useMaterialsGridFilters } from "./materials-grid/use-materials-grid-filters";
import { MaterialsGridPagination } from "./materials-grid/meterials-grid-pagination";
import { GridSkeleton } from "./grid-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import { authClient } from "@/features/auth/auth-client";

import { MaterialsAuthContext } from "@/features/materials/materials-auth-context";
import { useLessonsGridFilters } from "@/features/lessons/components/lessons-grid/use-lessons-grid-filters";
import MaterialCard from "./material-card";
// import { UpdateLesson } from "./update-lesson-dialog";

interface Props {
  authContext: MaterialsAuthContext;
}

export function MaterialsListing({ authContext }: Props) {
  const { lessonId } = useLessonsGridFilters();
  const { page, limit, searchQuery, updateId } = useMaterialsGridFilters();
  const activeOrg = authClient.useActiveOrganization();
  const router = useRouter();

  const { data, error, isPending } = useGetMaterials({
    limit,
    page,
    search: searchQuery,
    lessonId,
  });

  // This part is essential for listen org changes and refresh lessons auth-context
  useEffect(() => {
    if (!activeOrg.data?.id) {
      return;
    }

    if (activeOrg.data?.id) {
      router.refresh();
    }
  }, [activeOrg.data?.id]);

  if (isPending) {
    return <GridSkeleton />;
  }

  if (!data || error) {
    return (
      <Card className="p-0">
        <CardContent className="p-4">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            Something went wrong !
          </CardTitle>
          <CardDescription className="mt-4">
            {error?.message || "Server error"}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* <UpdateLesson /> */}

      <div className=" flex flex-col gap-8 flex-1">
        {data.pagination.total > 0 ? (
          <div className="flex-1 grid grid-cols-3 gap-4">
            {data.data.map((material) => (
              <MaterialCard
                key={material.id}
                material={material as any}
                authContext={authContext}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <BookCopy className="size-12 text-foreground/60" />
            <div className="space-y-1 text-center">
              <h1 className="font-semibold text-xl font-heading">
                No any lesson materials here
              </h1>
              <p className="text-foreground/60 text-sm">
                There are no lesson materials available for selected lesson
              </p>
            </div>
          </div>
        )}

        <MaterialsGridPagination totalItems={data.pagination.total} />
      </div>
    </>
  );
}
