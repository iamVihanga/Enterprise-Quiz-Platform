import React from "react";
import {
  Link2Icon,
  BookOpenIcon,
  TrophyIcon,
  SettingsIcon,
  HomeIcon,
  GraduationCapIcon,
  LayoutGridIcon
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Props = {};

export function QuickLinks({}: Props) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 py-3">
        <CardTitle className="text-sm text-foreground/60 flex items-center gap-2">
          <Link2Icon size={16} className="text-primary" />
          Quick Links
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 dark:bg-secondary/30">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start h-8"
            >
              <Link href="/portal">
                <LayoutGridIcon size={16} className="mr-2 text-primary" />
                <span className="text-sm">Portal Home</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start h-8"
            >
              <Link href="/portal/quizzes">
                <GraduationCapIcon size={16} className="mr-2 text-primary" />
                <span className="text-sm">Quizzes</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start h-8"
            >
              <Link href="/portal/lessons">
                <BookOpenIcon size={16} className="mr-2 text-primary" />
                <span className="text-sm">Lessons</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start h-8"
            >
              <Link href="/portal/leaderboard">
                <TrophyIcon size={16} className="mr-2 text-primary" />
                <span className="text-sm">Leaderboard</span>
              </Link>
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start h-8"
            >
              <Link href="/dashboard/settings">
                <SettingsIcon
                  size={16}
                  className="mr-2 text-muted-foreground"
                />
                <span className="text-sm">Account Settings</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start h-8"
            >
              <Link href="/">
                <HomeIcon size={16} className="mr-2 text-muted-foreground" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
