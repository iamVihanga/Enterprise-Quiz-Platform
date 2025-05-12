import React from "react";
import { BookOpenIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonCard } from "./lesson-card";
import Link from "next/link";

// Mock data for lessons
const mockLessons = [
  {
    id: 1,
    name: "Introduction to Web Development",
    description:
      "Learn the basics of HTML, CSS, and JavaScript to build your first website",
    thumbnail: "/mock/lesson-webdev.jpg",
    materialCount: 5
  },
  {
    id: 2,
    name: "React for Beginners",
    description:
      "Start your journey with React, the popular JavaScript library for building user interfaces",
    thumbnail: "/mock/lesson-react.jpg",
    materialCount: 4
  },
  {
    id: 3,
    name: "Database Fundamentals",
    description:
      "Understand the core concepts of databases, SQL, and data modeling",
    thumbnail: "/mock/lesson-db.jpg",
    materialCount: 3
  },
  {
    id: 4,
    name: "UX Design Principles",
    description:
      "Learn the essential principles of designing user-friendly interfaces",
    thumbnail: "/mock/lesson-ux.jpg",
    materialCount: 6
  }
];

type Props = {};

export function ExploreLessonsSection({}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpenIcon size={20} className="text-primary" />
          <h2 className="text-lg font-medium">Explore Lessons</h2>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/lessons" className="flex items-center gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockLessons.map((lesson) => (
          <LessonCard key={lesson.id} {...lesson} />
        ))}
      </div>
    </section>
  );
}
