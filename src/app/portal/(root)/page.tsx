import React from "react";
import { headers } from "next/headers";
import {
  BookOpenIcon,
  PlusCircleIcon,
  ClockIcon,
  TrophyIcon,
  LineChart,
  SchoolIcon
} from "lucide-react";

import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import our new section components
import { RecentQuizzesSection } from "@/features/portal/components/recent-quizzes-section";
import { ExploreLessonsSection } from "@/features/portal/components/explore-lessons-section";
import { BrowseMaterialsSection } from "@/features/portal/components/browse-materials-section";
import { PortalClassSwitcher } from "@/features/portal/components/class-switcher";

type Props = {};

export default async function PortalPage({}: Props) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Get the time of day for personalized greeting
  const currentHour = new Date().getHours();
  let greeting = "Welcome";
  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const firstName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <div className="space-y-8">
      {/* Hero header section */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background"></div>

        <div className="relative py-10 px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-4 bg-background/80 backdrop-blur-sm"
              >
                Enterprise Quiz Platform
              </Badge>

              <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-2">
                {greeting}, <span className="text-primary">{firstName}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl">
                Welcome to your personalized learning portal. Track your
                progress, expand your knowledge, and challenge your
                understanding with our interactive quizzes.
              </p>
            </div>

            {/* <div className="hidden md:flex items-center justify-center mt-6 md:mt-0">
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BookOpenIcon size={18} className="text-primary" />
                  <div>
                    <span className="text-muted-foreground">
                      Your next quiz is scheduled for
                    </span>
                    <p className="text-base font-semibold">Today at 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button size="sm" variant="default">
              <PlusCircleIcon size={16} className="mr-1" /> Start Quiz
            </Button>
            <Button size="sm" variant="outline">
              <LineChart size={16} className="mr-1" /> View Progress
            </Button>
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary hover:-translate-y-2 ease-in-out duration-300">
          <CardContent className="p-6 flex flex-col items-start">
            <PlusCircleIcon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-medium text-lg">Start New Quiz</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Test your knowledge with our latest quizzes
            </p>
            <Button size="sm" className="mt-auto">
              Browse Quizzes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:-translate-y-2 ease-in-out duration-300">
          <CardContent className="p-6 flex flex-col items-start">
            <ClockIcon className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="font-medium text-lg">Continue Learning</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pick up where you left off and keep learning
            </p>
            <Button size="sm" className="mt-auto">
              Resume
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:-translate-y-2 ease-in-out duration-300">
          <CardContent className="p-6 flex flex-col items-start">
            <TrophyIcon className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="font-medium text-lg">Achievements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View your accomplishments and milestones
            </p>
            <Button size="sm" className="mt-auto">
              View Achievements
            </Button>
          </CardContent>
        </Card>
      </div>

      {!session?.session.activeOrganizationId ? (
        <Card className="p-0 flex flex-col items-center justify-center py-16 border-dashed bg-card/80">
          <div className="p-3 rounded-xl bg-primary/10">
            <SchoolIcon className="size-6 text-primary" />
          </div>

          <div className="flex flex-col items-center text-center mt-3 space-y-1">
            <h2>Select Class to Get Started</h2>
            <p className="text-xs text-foreground/50">{`You need to have active class to see Quizzes, Lessons & more`}</p>
          </div>

          <div className="w-64 mt-4">
            <PortalClassSwitcher dropdownSide="top" refetch />
          </div>
        </Card>
      ) : (
        <>
          {/* Recently enrolled quizzes section */}
          <RecentQuizzesSection />

          {/* Explore lessons section */}
          <ExploreLessonsSection />

          {/* Browse materials section */}
          <BrowseMaterialsSection />
        </>
      )}
    </div>
  );
}
