import { QuickStats } from "@/components/dashboard/QuickStats";
import { getDashboardStats } from "@/lib/dashboard-data";

export async function StatsSection() {
  const { total, completed, rate } = await getDashboardStats();

  return <QuickStats total={total} completed={completed} rate={rate} />;
}
