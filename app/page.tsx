import { Suspense } from "react";
import {
  DashboardHeader,
  DashboardHeaderSkeleton,
} from "@/components/dashboard/DashboardHeader";
import {
  StatsSection,
  StatsSectionSkeleton,
} from "@/components/dashboard/StatsSection";
import {
  HabitsSection,
  HabitsSectionSkeleton,
} from "@/components/dashboard/HabitsSection";
import {
  MealsSection,
  MealsSectionSkeleton,
} from "@/components/dashboard/MealsSection";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<DashboardHeaderSkeleton />}>
        <DashboardHeader />
      </Suspense>

      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSection />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<HabitsSectionSkeleton />}>
          <HabitsSection />
        </Suspense>
        <Suspense fallback={<MealsSectionSkeleton />}>
          <MealsSection />
        </Suspense>
      </div>
    </div>
  );
}
