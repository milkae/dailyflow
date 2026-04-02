import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { HabitsSection } from "@/components/dashboard/HabitsSection";
import { MealsSection } from "@/components/dashboard/MealsSection";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-8">
        <DashboardHeader />
        <StatsSection />
        <div className="grid gap-6 lg:grid-cols-2">
          <HabitsSection />
          <MealsSection />
        </div>
      </div>
    </Suspense>
  );
}
