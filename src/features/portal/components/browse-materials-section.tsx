import React from "react";
import { FileTextIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialCard } from "./material-card";
import Link from "next/link";

// Mock data for materials
const mockMaterials = [
  {
    id: 1,
    name: "HTML Basics Cheatsheet",
    description:
      "A comprehensive reference guide to HTML elements and attributes",
    thumbnail: "/mock/material-html.jpg",
    lessonId: 1
  },
  {
    id: 2,
    name: "CSS Grid Layout Tutorial",
    description: "Learn how to create complex layouts using CSS Grid",
    thumbnail: "/mock/material-css.jpg",
    lessonId: 1
  },
  {
    id: 3,
    name: "JavaScript Arrays and Objects",
    description:
      "In-depth guide to working with arrays and objects in JavaScript",
    thumbnail: "/mock/material-js.jpg",
    lessonId: 1
  }
];

type Props = {};

export function BrowseMaterialsSection({}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileTextIcon size={20} className="text-primary" />
          <h2 className="text-lg font-medium">Browse Materials</h2>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/materials" className="flex items-center gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMaterials.map((material) => (
          <MaterialCard key={material.id} {...material} />
        ))}
      </div>
    </section>
  );
}
