import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MealSlot } from "@/app/(meals)/_components/MealSlot";
import { buttonVariants } from "@/app/_components/ui/buttonVariants";
import { MealType } from "@/generated/prisma/enums";
import { Heading } from "@/app/_components/ui/typography";
import { MealWithRecipeName } from "@/app/(meals)/types";

export function TodayMeals({ meals }: { meals: MealWithRecipeName[] }) {
  const mealsByType = meals.reduce(
    (acc, meal) => {
      acc[meal.type] = meal;
      return acc;
    },
    {} as Record<MealType, MealWithRecipeName>,
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading as="h2" className="text-2xl font-bold">
          Meals
        </Heading>
        <Link
          href="/meals"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Plan Week
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>

      <div className="space-y-3">
        {Object.values(MealType).map((type) => {
          if (type === MealType.SNACK) {
            return;
          }
          return <MealSlot key={type} type={type} meal={mealsByType[type]} />;
        })}
      </div>

      {meals.length === 0 && (
        <Link
          href="/meals"
          className={
            buttonVariants({ variant: "outline", size: "sm" }) + " w-full"
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Plan Meals
        </Link>
      )}
    </section>
  );
}
