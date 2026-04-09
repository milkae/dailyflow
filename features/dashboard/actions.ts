import { cache } from "react";
import { isHabitActiveOnDate, isHabitCompletedOnDate } from "@/utils/habits";
import prisma from "@/lib/prisma";
import { verifySession } from "../../lib/dal";
import { getHabitsForUser } from "../habits/actions";
import { normalizeDate } from "@/utils/date";

const getDashboardDataForSession = async ({
  userId,
  today,
  tomorrow,
}: {
  userId: string;
  today: Date;
  tomorrow: Date;
}) => {
  "use cache";
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

export const getDashboardData = cache(async () => {
  const session = await verifySession();

  const today = normalizeDate(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getDashboardDataForSession({
    userId: session.userId,
    today,
    tomorrow,
  });
});

export const getTodayMeals = cache(async () => {
  const { meals } = await getDashboardData();
  return meals;
});

export const getTodayHabits = cache(async () => {
  const { habits } = await getDashboardData();
  return habits;
});

export const getDashboardStats = cache(async () => {
  const { stats } = await getDashboardData();
  return stats;
});
