"use client";

import { Flame, Trash2, Circle, CheckCircle2 } from "lucide-react";
import { Habit, Entry } from "@/generated/prisma/client";
import { deleteHabit, setHabitCompleted } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";

export const HabitCard = ({
  habit,
}: {
  habit: Habit & { entries: Entry[]; streak: number };
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCompletedToday = habit.entries.some((entry) => {
    return entry.date.getTime() === today.getTime();
  });

  return (
    <Card className="group p-6 space-y-4 justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex-1 min-w-0 font-semibold text-slate-900 dark:text-slate-50 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {habit.streak > 0 && (
            <Badge className="bg-orange-100 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300">
              <Flame
                className="text-orange-600 dark:text-orange-400"
                data-icon="inline-start"
              />
              <span className="text-xs font-bold">{habit.streak}</span>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => deleteHabit(habit.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        onClick={() => setHabitCompleted(habit.id, !isCompletedToday)}
        className={
          isCompletedToday
            ? "w-full flex items-center px-4 py-2 rounded-sm bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            : "w-full flex items-center px-4 py-2 rounded-sm border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300"
        }
      >
        {isCompletedToday ? (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Done today
          </>
        ) : (
          <>
            <Circle className="h-4 w-4 mr-2" />
            Mark as done
          </>
        )}
      </Button>
    </Card>
  );
};
