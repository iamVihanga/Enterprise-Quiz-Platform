import React from "react";
import { BookOpenIcon, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type LessonCardProps = {
  id: number;
  name: string;
  description: string | null;
  thumbnail: string | null;
  materialCount?: number;
};

export function LessonCard({
  id,
  name,
  description,
  thumbnail,
  materialCount = 0
}: LessonCardProps) {
  return (
    <Link href={`/portal/lessons/${id}`} className="block">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-40 w-full">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-secondary/40 flex items-center justify-center">
              <BookOpenIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-base line-clamp-1">{name}</h3>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
              {description}
            </p>
          )}

          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {materialCount} {materialCount === 1 ? "material" : "materials"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
