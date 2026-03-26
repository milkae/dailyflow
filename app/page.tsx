import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodayHabits } from "@/components/dashboard/TodayHabits";
import { isHabitActiveOnDate, parseHabit } from "@/lib/habits";
import prisma from "@/lib/prisma";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      entries: {
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayHabits = habits
    .filter((habit) => isHabitActiveOnDate(habit, today))
    .map(parseHabit);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <TodayHabits habits={todayHabits} />
    </div>
  );
}
