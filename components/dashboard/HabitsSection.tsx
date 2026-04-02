import { TodayHabits } from "@/components/dashboard/TodayHabits";
import { getTodayHabits } from "@/lib/dashboard-data";

export async function HabitsSection() {
  const habits = await getTodayHabits();

  return <TodayHabits habits={habits} />;
}
