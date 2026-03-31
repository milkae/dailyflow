import { TodayMeals } from "@/components/dashboard/TodayMeals";
import { getTodayMeals } from "@/lib/dashboard-data";
import { Card } from "../ui/card";

export async function MealsSection() {
  const meals = await getTodayMeals();

  return <TodayMeals meals={meals} />;
}

export function MealsSectionSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-muted rounded w-20 animate-pulse" />
        <div className="h-8 bg-muted rounded w-24 animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 flex-row items-center">
            <div className="h-6 w-6 bg-muted rounded animate-pulse" />
            <div className="w-1/4 space-y-2.5">
              <div className="h-7 bg-muted rounded animate-pulse" />
              <div className="h-5 bg-muted rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
