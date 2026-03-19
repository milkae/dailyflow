"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Croissant, Salad, Cookie, Soup, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddMealDialog } from "@/components/AddMealDialog";
import { capitalize } from "@/lib/utils";
import { MealType } from "@/generated/prisma/enums";
import { Meal } from "@/generated/prisma/client";
import { deleteMeal } from "@/lib/actions";

type Props = {
  meals: Record<string, Record<string, Meal>>;
};

const MealIcons = {
  [MealType.breakfast]: <Croissant />,
  [MealType.lunch]: <Salad />,
  [MealType.snack]: <Cookie />,
  [MealType.dinner]: <Soup />,
};

const mealTypes = Object.values(MealType).map((v) => ({
  value: v,
  label: capitalize(v),
  icon: MealIcons[v],
}));

const getWeekDays = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date;
  });
};

export function WeeklyMealPlanner({ meals }: Props) {
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    type: MealType;
  } | null>(null);

  const weekDays = getWeekDays();

  const getMeal = (date: Date, type: string) => {
    const dateKey = date.toISOString().split("T")[0];
    return meals[dateKey]?.[type];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((date) => (
            <Card
              key={date.toISOString()}
              className={`p-4 ${isToday(date) ? "ring-2 ring-tertiary" : ""}`}
            >
              <div className="mb-4 pb-3 border-b">
                <div className="font-semibold">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`
                    text-2xl font-bold
                    ${isToday(date) ? "text-tertiary" : "text-foreground"}
                  `}
                >
                  {date.getDate()}
                </div>
              </div>

              <div className="space-y-3">
                {mealTypes.map(({ value, label, icon }) => {
                  const meal = getMeal(date, value);

                  return (
                    <div key={`${date}-${value}`} className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{icon}</span>
                        <span>{label}</span>
                      </div>

                      {meal ? (
                        <div className="p-3 group relative rounded-lg border bg-tertiary-muted hover:border-tertiary transition-colors">
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
                              setSelectedSlot({ date, type: value })
                            }
                          >
                            <p className="text-sm font-medium mb-1">
                              {meal.name}
                            </p>
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
                          onClick={() => setSelectedSlot({ date, type: value })}
                          className="w-full h-16 border-2 border-dashed hover:border-tertiary hover:bg-tertiary-muted dark:hover:bg-tertiary-muted hover:text-tertiary-muted-foreground transition-colors"
                        >
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedSlot && (
        <AddMealDialog
          open={!!selectedSlot}
          onOpenChange={(open) => !open && setSelectedSlot(null)}
          mealType={selectedSlot.type}
          date={selectedSlot.date}
          existingMeal={getMeal(selectedSlot.date, selectedSlot.type)}
        />
      )}
    </>
  );
}
