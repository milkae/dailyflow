import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HabitWithEntries } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isHabitCompletedToday(habit: HabitWithEntries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return habit.entries.some((entry) => {
    return entry.date.getTime() === today.getTime();
  });
}

export function getLastWeekHabits(
  habits: HabitWithEntries[],
  fromToday: boolean = false,
) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    const daysToRemove = fromToday ? 6 : date.getDay();
    date.setDate(date.getDate() - daysToRemove + i);
    date.setHours(0, 0, 0, 0);

    const count = habits.reduce((acc, val) => {
      return (
        acc +
        val.entries.filter((e) => {
          const entryDate = new Date(e.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === date.getTime();
        }).length
      );
    }, 0);
    return {
      day: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(date),
      count,
    };
  });
}
