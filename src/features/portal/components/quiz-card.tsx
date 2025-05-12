import React from "react";
import { GraduationCapIcon, Clock, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

type QuizCardProps = {
  id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  timeLimit: number | null;
  passingScore: number | null;
  isEnrolled?: boolean;
};

export function QuizCard({
  id,
  title,
  description,
  thumbnail,
  timeLimit,
  passingScore,
  isEnrolled = false
}: QuizCardProps) {
  return (
    <Link href={`/portal/quizzes/${id}`} className="block">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-40 w-full">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-secondary/40 flex items-center justify-center">
              <GraduationCapIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {isEnrolled && (
            <Badge
              className="absolute top-2 right-2 bg-primary text-primary-foreground"
              variant="outline"
            >
              Enrolled
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-base line-clamp-1">{title}</h3>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            {timeLimit && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {Math.floor(timeLimit / 60)} min
              </span>
            )}

            {passingScore && (
              <span className="flex items-center gap-1">
                <BarChart3 size={14} />
                {passingScore}% to pass
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
