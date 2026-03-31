import { QuickStats } from "@/components/dashboard/QuickStats";
import { getDashboardStats } from "@/lib/dashboard-data";

export async function StatsSection() {
  const { total, completed, rate } = await getDashboardStats();

  return <QuickStats total={total} completed={completed} rate={rate} />;
}

export function StatsSectionSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="py-6 px-4 border rounded-lg gap-3 flex">
          <div className="h-10 w-10 bg-muted rounded animate-pulse" />
          <div className="space-y-3.5  w-1/4">
            <div className="h-3 bg-muted rounded animate-pulse" />
            <div className="h-7 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
