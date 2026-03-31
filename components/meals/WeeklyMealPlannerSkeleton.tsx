"use client";

import { Card } from "@/components/ui/card";
import { Croissant, Salad, Cookie, Soup } from "lucide-react";
import { capitalize } from "@/lib/utils";
import { MealType } from "@/generated/prisma/enums";
import { Skeleton } from "../ui/skeleton";

const MealIcons = {
  [MealType.breakfast]: <Croissant />,
  [MealType.lunch]: <Salad />,
  [MealType.snack]: <Cookie />,
  [MealType.dinner]: <Soup />,
};

export const WeeklyMealPlannerSkeleton = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        const isToday = date.toDateString() === today.toDateString();

        return (
          <Card
            key={`${date.toISOString()}-desktop`}
            className={`p-4 ${isToday ? "ring-2 ring-tertiary" : ""}`}
          >
            <div className="flex items-center gap-2 lg:flex-col pb-3 border-b">
              <div className="text-lg font-semibold">
                {date.toLocaleDateString("en-US", { weekday: "long" })}
              </div>
              <div
                className={`text-lg lg:text-2xl font-bold ${isToday ? "text-tertiary" : "text-foreground"}`}
              >
                {date.getDate()}
              </div>
            </div>
            <div className="space-y-3">
              {Object.values(MealType).map((type) => (
                <div key={`${date}-${type}-desktop`} className="space-y-2">
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
