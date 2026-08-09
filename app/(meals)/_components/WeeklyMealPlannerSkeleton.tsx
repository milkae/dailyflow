"use client";

import { Card } from "@/app/_components/ui/card";
import { Croissant, Salad, Cookie, Soup } from "lucide-react";
import { capitalize } from "@/utils/string";
import { MealType } from "@/generated/prisma/enums";
import { Skeleton } from "@/app/_components/ui/skeleton";

const MealIcons = {
  [MealType.BREAKFAST]: <Croissant />,
  [MealType.LUNCH]: <Salad />,
  [MealType.SNACK]: <Cookie />,
  [MealType.DINNER]: <Soup />,
};

export const WeeklyMealPlannerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {Array.from({ length: 7 }, (_, i) => {
        return (
          <Card key={`${i}-desktop`} className="p-4">
            <div className="flex items-center gap-2 lg:flex-col pb-3 border-b">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="size-8" />
            </div>
            <div className="space-y-3">
              {Object.values(MealType).map((type) => (
                <div key={`${i}-${type}-desktop`} className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{MealIcons[type]}</span>
                    <span>{capitalize(type)}</span>
                  </div>

                  <Skeleton className="size-16 w-full shrink-0 rounded-lg" />
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
