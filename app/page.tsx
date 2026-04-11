import { getDashboardData } from "@/features/dashboard/actions";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { QuickStats } from "@/features/dashboard/components/QuickStats";
import { TodayHabits } from "@/features/dashboard/components/TodayHabits";
import { TodayMeals } from "@/features/dashboard/components/TodayMeals";
import { getUserId } from "@/lib/dal";

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
