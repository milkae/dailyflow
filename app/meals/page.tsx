import { BookOpen } from "lucide-react";
import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";
import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { buttonVariants } from "@/lib/utils";
import { getWeekMeals } from "@/lib/actions/meal";

export default async function MealsPage() {
  const mealsPromise = getWeekMeals();

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
      <WeeklyMealPlanner mealsPromise={mealsPromise} />
    </div>
  );
}
