import React from "react";
import { SelectMaterial } from "../schemas/db-schema";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  material: SelectMaterial;
};

export default function MaterialCard({ material }: Props) {
  return (
    <Card>
      <CardTitle>{material.name}</CardTitle>
      <CardDescription>{material.description?.slice(0, 100)}</CardDescription>

      <CardFooter className=" flex justify-end">
        <Button asChild>
          <Link href={`/dashboard/materials/${material.id}`}>
            Open Lesson Material
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
