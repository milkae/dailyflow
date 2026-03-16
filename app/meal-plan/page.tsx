import { prisma } from "@/lib/prisma";
import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";
import { Meal } from "@/generated/prisma/client";

export default async function MealPlanPage() {
  const meals = await prisma.meal.findMany({
    include: {
      recipe: true,
    },
    orderBy: [{ date: "asc" }, { type: "asc" }],
  });

  const mealsByDateAndType = meals.reduce(
    (acc, meal) => {
      const dateKey = new Date(meal.date).toISOString().split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = {};
      acc[dateKey][meal.type] = meal;
      return acc;
    },
    {} as Record<string, Record<string, Meal>>,
  );

  return (
    <main>
      <h1>Weekly Meal Plan</h1>
      <p>Plan your meals for the week ahead</p>
      <WeeklyMealPlanner meals={mealsByDateAndType} />
    </main>
  );
}
