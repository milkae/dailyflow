import { cacheLife, cacheTag } from "next/cache";
import { isHabitActiveOnDate, isHabitCompletedOnDate } from "@/utils/habits";
import prisma from "@/lib/prisma";
import { getHabitsForUser } from "@/app/(habits)/actions";
import { normalizeDate } from "@/utils/date";
import type { TypedHabitWithEntries } from "@/app/(habits)/types";
import type { MealWithRecipeName } from "@/app/(meals)/types";
import type { Todo } from "@/generated/prisma/client";

export type DashboardStats = {
  total: number;
  completed: number;
  rate: number;
  mealsCount: number;
  pendingTodos: number;
};

export type DashboardData = {
  habits: TypedHabitWithEntries[];
  meals: MealWithRecipeName[];
  todos: Todo[];
  stats: DashboardStats;
};

const getDashboardDataCached = async (userId: string) => {
  "use cache";
  cacheLife("days");
  cacheTag("dashboard");

  const today = normalizeDate(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [habits, meals, todos, pendingTodos] = await Promise.all([
    getHabitsForUser({ userId }),
    prisma.meal.findMany({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
      include: { recipe: { select: { id: true, name: true } } },
    }),
    prisma.todo.findMany({
      where: {
        userId,
        isDone: false,
      },
      orderBy: [{ urgent: "desc" }, { createdAt: "asc" }],
      take: 3,
    }),
    prisma.todo.count({
      where: {
        userId,
        isDone: false,
      },
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
    todos,
    stats: {
      total: todayHabits.length,
      completed: completedToday,
      rate: completionRate,
      mealsCount: meals.length,
      pendingTodos,
    },
  };
};

export const getDashboardData = async (userId: string) => {
  return getDashboardDataCached(userId);
};
