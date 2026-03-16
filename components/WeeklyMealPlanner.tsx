"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Croissant, Salad, Cookie, Soup } from "lucide-react";
import { useState } from "react";
import { AddMealDialog } from "@/components/AddMealDialog";
import { capitalize } from "@/lib/utils";
import { MealType } from "@/generated/prisma/enums";
import { Meal } from "@/generated/prisma/client";

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
              className={`
                bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
                ${isToday(date) ? "ring-2 ring-violet-500 dark:ring-violet-500" : ""}
              `}
            >
              <div className="p-4">
                <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-slate-50">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div
                    className={`
                    text-2xl font-bold
                    ${
                      isToday(date)
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-slate-900 dark:text-slate-50"
                    }
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
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <span>{icon}</span>
                          <span>{label}</span>
                        </div>

                        {meal ? (
                          <div className="group relative rounded-lg border border-slate-200 dark:border-slate-700 bg-violet-50 dark:bg-violet-950 p-3 hover:border-violet-500 dark:hover:border-violet-500 transition-colors">
                            <div
                              className="cursor-pointer"
                              onClick={() =>
                                setSelectedSlot({ date, type: value })
                              }
                            >
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                                {meal.name}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={() =>
                              setSelectedSlot({ date, type: value })
                            }
                            className="w-full h-16 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-slate-400" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
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
