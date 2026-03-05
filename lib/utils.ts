import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HabitWithEntries } from "./prisma";
import { Entry, Habit } from "@/generated/prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHabitEntryForToday(habit: HabitWithEntries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return habit.entries.find((entry) => {
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

export const calculateStreaks = (habit: Habit & { entries: Entry[] }) => {
  let streak = 0;

  for (let i = habit.entries.length - 1; i > 0; i--) {
    const previousDay = new Date(habit.entries[i].date.getTime());
    previousDay.setDate(previousDay.getDate() - 1);
    previousDay.setHours(0, 0, 0, 0);
    const nextHabitDate = habit.entries[i - 1].date;
    nextHabitDate.setHours(0, 0, 0, 0);

    if (nextHabitDate.getTime() !== previousDay.getTime()) {
      break;
    }

    streak++;
  }

  return { ...habit, streak };
};
