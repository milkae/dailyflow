import { getDashboardData } from "@/app/actions";
import { DashboardHeader } from "@/app/_components/DashboardHeader";
import { QuickStats } from "@/app/_components/QuickStats";
import { TodayHabits } from "@/app/_components/TodayHabits";
import { TodayMeals } from "@/app/_components/TodayMeals";
import { getUserId } from "@/lib/dal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your DailyFlow dashboard for today's habits, meals, and productivity insights.",
};

export default async function DashboardPage() {
  const userId = await getUserId();
  const { habits, meals, stats } = await getDashboardData(userId!);

  return (
    <div className="space-y-8">
      <DashboardHeader stats={stats} />
      <QuickStats stats={stats} />
      <div className="grid gap-6 lg:grid-cols-2">
        <TodayHabits habits={habits} />
        <TodayMeals meals={meals} />
      </div>
    </div>
  );
}
