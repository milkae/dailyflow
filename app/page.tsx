import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { TodayHabits } from "@/components/dashboard/TodayHabits";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { TodayMeals } from "@/components/dashboard/TodayMeals";

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
