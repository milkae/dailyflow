import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { HabitsSection } from "@/components/dashboard/HabitsSection";
import { MealsSection } from "@/components/dashboard/MealsSection";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsSection />
      <div className="grid gap-6 lg:grid-cols-2">
        <HabitsSection />
        <MealsSection />
      </div>
    </div>
  );
}
