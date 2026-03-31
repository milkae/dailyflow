import { TodayHabits } from "@/components/dashboard/TodayHabits";
import { getTodayHabits } from "@/lib/dashboard-data";
import { Card } from "../ui/card";

export async function HabitsSection() {
  const habits = await getTodayHabits();

  return <TodayHabits habits={habits} />;
}

export function HabitsSectionSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-muted rounded w-24 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 bg-muted rounded w-16 animate-pulse" />
          <div className="h-8 bg-muted rounded w-20 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 flex-row items-center">
            <div className="h-6.5 w-6.5 bg-muted rounded-full animate-pulse" />
            <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
          </Card>
        ))}
      </div>
    </section>
  );
}
