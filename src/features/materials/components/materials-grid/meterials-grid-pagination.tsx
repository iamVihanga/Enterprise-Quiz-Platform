"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMaterialsGridFilters } from "./use-materials-grid-filters";
import { useTransition } from "react";

interface MaterialsGridPaginationProps {
  totalItems: number;
}

export function MaterialsGridPagination({
  totalItems,
}: MaterialsGridPaginationProps) {
  const { page, setPage, limit } = useMaterialsGridFilters();
  const [isLoading, startTransition] = useTransition();

  const totalPages = Math.ceil(totalItems / limit);
  const showingStart = (page - 1) * limit + 1;
  const showingEnd = Math.min(page * limit, totalItems);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage, { startTransition });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    // Always show first page
    if (page > 3) {
      pages.push(1);
      if (page > 4) {
        pages.push("ellipsis");
      }
    }

    // Calculate range around current page
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPages, page + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (page < totalPages - 2) {
      if (page < totalPages - 3) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="text-sm text-muted-foreground">
        Showing <strong>{showingStart}</strong> to <strong>{showingEnd}</strong>{" "}
        of <strong>{totalItems}</strong> results
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isLoading}
          className={isLoading ? "animate-pulse" : ""}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((pageNum, idx) =>
          pageNum === "ellipsis" ? (
            <div key={`ellipsis-${idx}`} className="px-2">
              ...
            </div>
          ) : (
            <Button
              key={`page-${pageNum}`}
              variant={page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum as number)}
              disabled={isLoading}
              className={isLoading ? "animate-pulse" : ""}
            >
              {pageNum}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || isLoading}
          className={isLoading ? "animate-pulse" : ""}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
