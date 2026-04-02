import { Habit, Prisma } from "@/generated/prisma/browser";
import type { Frequency } from "@/generated/prisma/enums";

type ConfigShape = {
  DAILY: null;
  WEEKLY: { day: number };
  MONTHLY: { day: number };
  SPECIFIC_DAYS: { days: number[] };
  INTERVAL: { interval: number };
};

export const frequencyConfigMap = {
  DAILY: null,
  WEEKLY: { day: 0 },
  MONTHLY: { day: 1 },
  SPECIFIC_DAYS: { days: [] as number[] },
  INTERVAL: { interval: 1 },
} satisfies ConfigShape & Record<Frequency, unknown>;

type FrequencyConfigMap = typeof frequencyConfigMap;

export type HabitFrequencyConfig = {
  [K in keyof FrequencyConfigMap]: {
    frequency: K;
    frequencyConfig: FrequencyConfigMap[K];
  };
}[keyof FrequencyConfigMap];

export type TypedHabit = Omit<Habit, "frequency" | "frequencyConfig"> &
  HabitFrequencyConfig;

export type TypedHabitWithEntries = Omit<
  Prisma.HabitGetPayload<{
    include: { entries: true };
  }>,
  "frequency" | "frequencyConfig"
> &
  HabitFrequencyConfig;

export type MealWithRecipeName = Prisma.MealGetPayload<{
  include: { recipe: { select: { id: true; name: true } } };
}>;
