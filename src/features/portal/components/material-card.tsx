import React from "react";
import { FileTextIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type MaterialCardProps = {
  id: number;
  name: string;
  description: string | null;
  thumbnail: string | null;
  lessonId: number;
};

export function MaterialCard({
  id,
  name,
  description,
  thumbnail,
  lessonId
}: MaterialCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md flex flex-col">
      <div className="relative h-32 w-full">
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
            <FileTextIcon className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-base line-clamp-1">{name}</h3>
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3 flex-1">
            {description}
          </p>
        )}
        
        <div className="mt-auto pt-2">
          <Button size="sm" variant="outline" asChild className="w-full">
            <Link href={`/portal/lessons/${lessonId}/materials/${id}`}>
              View Material
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}