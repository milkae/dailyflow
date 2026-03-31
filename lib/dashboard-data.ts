import { cache } from "react";
import {
  isHabitActiveOnDate,
  isHabitCompletedOnDate,
  parseHabit,
} from "@/lib/habits";
import prisma from "@/lib/prisma";
import { verifySession } from "./dal";

export const getHabits = cache(async () => {
  const session = await verifySession();

  return prisma.habit.findMany({
    where: { userId: session.userId },
    include: {
      entries: {
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });
});

export const getTodayMeals = cache(async () => {
  const session = await verifySession();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.meal.findMany({
    where: {
      userId: session.userId,
      date: { gte: today, lt: tomorrow },
    },
  });
});

export const getTodayHabits = cache(async () => {
  const habits = await getHabits();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return habits.filter((h) => isHabitActiveOnDate(h, today)).map(parseHabit);
});

export const getDashboardStats = cache(async () => {
  const [todayHabits, todayMeals] = await Promise.all([
    getTodayHabits(),
    getTodayMeals(),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedToday = todayHabits.filter((habit) =>
    isHabitCompletedOnDate(habit, today),
  ).length;

  const completionRate =
    todayHabits.length > 0
      ? Math.round((completedToday / todayHabits.length) * 100)
      : 0;

  return {
    total: todayHabits.length,
    completed: completedToday,
    rate: completionRate,
    mealsCount: todayMeals.length,
  };
});
