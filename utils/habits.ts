import { Entry, Frequency, Habit, Prisma } from "@/generated/prisma/browser";
import { habitFrequencySchema } from "../lib/validators";
import { TypedHabitWithEntries } from "../features/habits/types";
import { normalizeDate } from "./date";
import { logError } from "@/lib/logger";

export function isHabitActiveOnDate(habit: TypedHabitWithEntries, date: Date) {
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

      const startDate = normalizeDate(habit.startDate);
      const targetDate = normalizeDate(date);

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
  const targetDate = normalizeDate(date);

  return habit.entries.some((entry) => {
    const entryDate = normalizeDate(entry.date);
    return entryDate.getTime() === targetDate.getTime();
  });
}

export function getHabitEntryForToday(habit: TypedHabitWithEntries) {
  const today = normalizeDate(new Date());

  return habit.entries.find((entry) => {
    const entryDate = normalizeDate(entry.date);
    return entryDate.getTime() === today.getTime();
  });
}

export function getLastWeekHabits(
  habits: TypedHabitWithEntries[],
  fromToday: boolean = false,
) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = normalizeDate(new Date());
    const daysToRemove = fromToday ? 6 : date.getDay();
    date.setDate(date.getDate() - daysToRemove + i);

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
      const today = normalizeDate(new Date());
      const entryDate = normalizeDate(habit.entries[i].date);
      if (entryDate.getTime() !== today.getTime()) {
        break;
      }
      streak++;
    } else {
      const previousDay = normalizeDate(habit.entries[i].date);
      previousDay.setDate(previousDay.getDate() - 1);
      const nextHabitEntryDate = normalizeDate(habit.entries[i - 1].date);

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
  const validatedFields = habitFrequencySchema.safeParse({
    frequency: habit.frequency,
    frequencyConfig: habit.frequencyConfig,
  });

  if (!validatedFields.success) {
    logError(validatedFields.error, "Parse habit validation error");
    throw new Error("Error while parsing habit's frequency");
  }

  return {
    ...habit,
    ...validatedFields.data,
  };
}
