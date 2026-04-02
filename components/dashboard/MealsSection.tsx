import { TodayMeals } from "@/components/dashboard/TodayMeals";
import { getTodayMeals } from "@/lib/dashboard-data";

export async function MealsSection() {
  const meals = await getTodayMeals();

  return <TodayMeals meals={meals} />;
}
