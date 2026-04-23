import { BookOpen } from "lucide-react";
import { WeeklyMealPlanner } from "@/features/meals/components/WeeklyMealPlanner";
import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { getWeekMeals } from "@/features/meals/actions";
import { Suspense } from "react";
import { WeeklyMealPlannerSkeleton } from "@/features/meals/components/WeeklyMealPlannerSkeleton";
import { getAllRecipes } from "@/features/recipes/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meals",
  description: "Plan weekly meals with DailyFlow.",
};

export default async function MealsPage() {
  const mealsPromise = getWeekMeals();
  const recipesPromise = getAllRecipes();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Weekly meals plan</Heading>
          <p className="text-muted-foreground mt-2">
            Plan your week and manage your recipes
          </p>
        </div>
        <Link
          href="/meals/recipes"
          className={
            buttonVariants() +
            "bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
          }
        >
          <BookOpen className="h-4 w-4 mr-2" />
          All Recipes
        </Link>
      </div>
      <Suspense fallback={<WeeklyMealPlannerSkeleton />}>
        <WeeklyMealPlanner
          mealsPromise={mealsPromise}
          recipesPromise={recipesPromise}
        />
      </Suspense>
    </div>
  );
}
