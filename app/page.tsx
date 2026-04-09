import { Suspense } from "react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { TodayHabits } from "@/features/dashboard/components/TodayHabits";
import { QuickStats } from "@/features/dashboard/components/QuickStats";
import { TodayMeals } from "@/features/dashboard/components/TodayMeals";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-8">
        <DashboardHeader />
        <QuickStats />
        <div className="grid gap-6 lg:grid-cols-2">
          <TodayHabits />
          <TodayMeals />
        </div>
      </div>
    </Suspense>
  );
}
