"use client";

import { use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Croissant,
  Salad,
  Cookie,
  Soup,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { AddMealDialog } from "@/components/meals/AddMealDialog";
import { capitalize } from "@/lib/utils";
import { MealType } from "@/generated/prisma/enums";
import { Meal } from "@/generated/prisma/client";
import { deleteMeal } from "@/lib/actions/meal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const MealIcons = {
  [MealType.breakfast]: <Croissant />,
  [MealType.lunch]: <Salad />,
  [MealType.snack]: <Cookie />,
  [MealType.dinner]: <Soup />,
};

interface MealsListProps {
  date: Date;
  meals: Record<MealType, Meal | null>;
  onSelection: ({
    date,
    type,
    meal,
  }: {
    date: Date;
    type: MealType;
    meal?: Meal;
  }) => void;
}

const MealsList = ({ date, meals, onSelection }: MealsListProps) => {
  return Object.entries(meals).map(([type, meal]) => {
    const mealType = type as MealType;
    return (
      <div key={`${date}-${type}`} className="space-y-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{MealIcons[mealType]}</span>
          <span>{capitalize(type)}</span>
        </div>

        {meal ? (
          <div className="p-3 group relative rounded-lg border bg-tertiary/5 hover:border-tertiary transition-colors">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full border bg-background hover:bg-destructive/90 dark:hover:bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteMeal(meal.id)}
            >
              <Trash2 />
            </Button>
            <div
              className="cursor-pointer"
              onClick={() =>
                onSelection({ date: meal.date, type: mealType, meal })
              }
            >
              <p className="text-sm font-medium mb-1">{meal.name}</p>
              {meal.notes && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {meal.notes}
                </p>
              )}
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => onSelection({ date, type: mealType })}
            className="w-full h-16 border-2 border-border border-dashed hover:border-tertiary hover:bg-tertiary-muted dark:hover:bg-tertiary-muted hover:text-tertiary-muted-foreground transition-colors"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    );
  });
};

export const WeeklyMealPlanner = ({
  mealsPromise,
}: {
  mealsPromise: Promise<{ date: Date; meals: Record<MealType, Meal | null> }[]>;
}) => {
  const mealsByDate = use(mealsPromise);
  const isMobile = useIsMobile();
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    type: MealType;
    meal?: Meal;
  } | null>(null);

  const today = new Date();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {mealsByDate.map(({ date, meals }) => {
          const isToday = date.toDateString() === today.toDateString();
          if (isMobile) {
            return (
              <Collapsible
                key={date.toISOString()}
                className={`p-4 space-y-4 rounded-xl bg-card ${isToday ? "ring-2 ring-tertiary" : ""}`}
                defaultOpen={isToday}
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between lg:flex-col">
                  <div className="text-lg font-semibold flex gap-2">
                    <span>
                      {date.toLocaleDateString("en-US", { weekday: "long" })}
                    </span>
                    <span
                      className={`lg:text-2xl font-bold ${isToday ? "text-tertiary" : "text-foreground"}`}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3">
                  <MealsList
                    meals={meals}
                    date={date}
                    onSelection={setSelectedSlot}
                  />
                </CollapsibleContent>
              </Collapsible>
            );
          }

          return (
            <Card
              key={date.toISOString()}
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
                <MealsList
                  meals={meals}
                  date={date}
                  onSelection={setSelectedSlot}
                />
              </div>
            </Card>
          );
        })}
      </div>
      {selectedSlot && (
        <AddMealDialog
          open={!!selectedSlot}
          onOpenChange={(open) => !open && setSelectedSlot(null)}
          mealType={selectedSlot.type}
          date={selectedSlot.date}
          existingMeal={selectedSlot.meal}
        />
      )}
    </>
  );
};
