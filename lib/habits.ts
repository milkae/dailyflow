import { Entry, Frequency, Habit, Prisma } from "@/generated/prisma/browser";
import { habitSchema } from "./validators";
import { TypedHabitWithEntries } from "./types";

export function isHabitActiveOnDate(habit: Habit, date: Date) {
  switch (habit.frequency) {
    case Frequency.DAILY:
      return true;
    case Frequency.WEEKLY: {
      const config = habit.frequencyConfig as { day: number } | null;
      if (!config?.day) return false;
      return date.getDay() === config.day;
    }
    case Frequency.MONTHLY: {
      const config = habit.frequencyConfig as { day: number } | null;
      if (!config?.day) return false;
      return date.getDate() === config.day;
    }
    case Frequency.SPECIFIC_DAYS: {
      const config = habit.frequencyConfig as { days: number[] } | null;
      if (!config?.days || !config?.days?.length || !Array.isArray(config.days))
        return false;

      return config.days?.includes(date.getDay());
    }
    case Frequency.INTERVAL: {
      const config = habit.frequencyConfig as { interval: number } | null;
      if (!config?.interval) return false;
      const startDate = new Date(habit.startDate);
      startDate.setHours(0, 0, 0, 0);

      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysDiff >= 0 && daysDiff % config.interval === 0;
    }
    default:
      return true;
  }
}

export function isHabitCompletedOnDate(
  habit: TypedHabitWithEntries,
  date: Date,
) {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return habit.entries.some((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === targetDate.getTime();
  });
}

export function getHabitEntryForToday(habit: TypedHabitWithEntries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return habit.entries.find((entry) => {
    return entry.date.getTime() === today.getTime();
  });
}

export function getLastWeekHabits(
  habits: TypedHabitWithEntries[],
  fromToday: boolean = false,
) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    const daysToRemove = fromToday ? 6 : date.getDay();
    date.setDate(date.getDate() - daysToRemove + i);
    date.setHours(0, 0, 0, 0);

    const completed = habits.filter((habit) =>
      isHabitCompletedOnDate(habit, date),
    ).length;

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      completed,
      date: date.toISOString(),
    };
  });
}

export const calculateStreak = (habit: Habit & { entries: Entry[] }) => {
  let streak = 0;

  for (let i = habit.entries.length - 1; i >= 0; i--) {
    if (i === habit.entries.length - 1) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const entryDate = habit.entries[i].date;
      entryDate.setHours(0, 0, 0, 0);
      if (entryDate.getTime() !== today.getTime()) {
        break;
      }
      streak++;
    } else {
      const previousDay = new Date(habit.entries[i].date.getTime());
      previousDay.setDate(previousDay.getDate() - 1);
      previousDay.setHours(0, 0, 0, 0);
      const nextHabitEntryDate = habit.entries[i - 1].date;
      nextHabitEntryDate.setHours(0, 0, 0, 0);

      if (nextHabitEntryDate.getTime() !== previousDay.getTime()) {
        break;
      }

      streak++;
    }
  }
  return streak;
};

export function parseHabit(
  habit: Prisma.HabitGetPayload<{
    include: { entries: true };
  }>,
): TypedHabitWithEntries {
  const parsed = habitSchema.parse({
    frequency: habit.frequency,
    frequencyConfig: habit.frequencyConfig,
  });

  return {
    ...habit,
    ...parsed,
  };
}
