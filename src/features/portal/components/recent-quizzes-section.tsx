import React from "react";
import { GraduationCapIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizCard } from "./quiz-card";
import Link from "next/link";

// Mock data for recent quizzes
const mockQuizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and control flow",
    thumbnail: "/mock/quiz-js.jpg",
    timeLimit: 1800, // 30 mins
    passingScore: 70,
    isEnrolled: true
  },
  {
    id: 2,
    title: "React Hooks Advanced",
    description:
      "Dive deeper into React hooks like useContext, useReducer, and custom hooks",
    thumbnail: "/mock/quiz-react.jpg",
    timeLimit: 2400, // 40 mins
    passingScore: 75,
    isEnrolled: true
  },
  {
    id: 3,
    title: "Web Accessibility",
    description:
      "Learn the basics of making web applications accessible to all users",
    thumbnail: "/mock/quiz-a11y.jpg",
    timeLimit: 1200, // 20 mins
    passingScore: 65,
    isEnrolled: true
  }
];

type Props = {};

export function RecentQuizzesSection({}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCapIcon size={20} className="text-primary" />
          <h2 className="text-lg font-medium">Recently Enrolled Quizzes</h2>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/portal/quizzes" className="flex items-center gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} {...quiz} />
        ))}
      </div>
    </section>
  );
}
