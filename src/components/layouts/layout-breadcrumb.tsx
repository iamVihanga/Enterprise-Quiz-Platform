"use client";

import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function LayoutBreadcrumb() {
  const pathname = usePathname();

  const pathList = pathname.slice(1).split("/");

  const pathListFormatted = pathname
    .slice(1)
    .split("/")
    .map((path) => path.charAt(0).toUpperCase() + path.slice(1));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink
            href={`/${pathList[0]}`}
            className={
              pathList.length === 1 ? "dark:text-white text-black" : ""
            }
          >
            {pathListFormatted[0]}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathList.length > 1 &&
          pathList.slice(1).map((path, index) => (
            <div key={index} className="flex items-center gap-2">
              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${pathList[0]}/${path}`}
                  className={
                    pathList.length === index + 2
                      ? "dark:text-white text-black"
                      : ""
                  }
                >
                  {pathListFormatted[index + 1]}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
