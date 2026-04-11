import { cacheLife, cacheTag } from "next/cache";
import { isHabitActiveOnDate, isHabitCompletedOnDate } from "@/utils/habits";
import prisma from "@/lib/prisma";
import { getHabitsForUser } from "../habits/actions";
import { normalizeDate } from "@/utils/date";
import type { TypedHabitWithEntries } from "@/features/habits/types";
import type { MealWithRecipeName } from "@/features/meals/types";

export type DashboardStats = {
  total: number;
  completed: number;
  rate: number;
  mealsCount: number;
};

export type DashboardData = {
  habits: TypedHabitWithEntries[];
  meals: MealWithRecipeName[];
  stats: DashboardStats;
};

const getDashboardDataCached = async (userId: string) => {
  "use cache";
  cacheLife("days");
  cacheTag("dashboard");

  const today = normalizeDate(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [habits, meals] = await Promise.all([
    getHabitsForUser({ userId }),
    prisma.meal.findMany({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
      include: { recipe: { select: { id: true, name: true } } },
    }),
  ]);

  const todayHabits = habits.filter((habit) =>
    isHabitActiveOnDate(habit, today),
  );
  const completedToday = todayHabits.filter((habit) =>
    isHabitCompletedOnDate(habit, today),
  ).length;

  const completionRate =
    todayHabits.length > 0
      ? Math.round((completedToday / todayHabits.length) * 100)
      : 0;

  return {
    habits: todayHabits,
    meals,
    stats: {
      total: todayHabits.length,
      completed: completedToday,
      rate: completionRate,
      mealsCount: meals.length,
    },
  };
};

export const getDashboardData = async (userId: string) => {
  return getDashboardDataCached(userId);
};
