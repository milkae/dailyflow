import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { TodayHabits } from "@/components/dashboard/TodayHabits";
import { TodayMeals } from "@/components/dashboard/TodayMeals";
import {
  isHabitActiveOnDate,
  isHabitCompletedOnDate,
  parseHabit,
} from "@/lib/habits";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      entries: {
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });

  const todayHabits = habits
    .filter((h) => isHabitActiveOnDate(h, today))
    .map(parseHabit);

  const completedToday = todayHabits.filter((habit) =>
    isHabitCompletedOnDate(habit, today),
  ).length;

  const completionRate =
    todayHabits.length > 0
      ? Math.round((completedToday / todayHabits.length) * 100)
      : 0;

  const todayMeals = await prisma.meal.findMany({
    where: {
      userId: session.user.id,
      date: { gte: today, lt: tomorrow },
    },
    orderBy: { type: "asc" },
  });

  return (
    <div className="space-y-8">
      <DashboardHeader
        completedCount={completedToday}
        totalCount={todayHabits.length}
        mealsCount={todayMeals.length}
      />

      <QuickStats
        total={todayHabits.length}
        completed={completedToday}
        rate={completionRate}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayHabits habits={todayHabits} />
        <TodayMeals meals={todayMeals} />
      </div>
    </div>
  );
}
