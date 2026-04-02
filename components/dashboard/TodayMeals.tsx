"use client";

import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MealSlot } from "@/components/meals/MealSlot";
import { buttonVariants } from "@/lib/utils";
import { MealType } from "@/generated/prisma/enums";
import { Heading } from "../ui/typography";
import { MealWithRecipeName } from "@/lib/types";

type Props = {
  meals: MealWithRecipeName[];
};

export function TodayMeals({ meals }: Props) {
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
          if (type === MealType.snack) {
            return;
          }
          return <MealSlot key={type} type={type} meal={mealsByType[type]} />;
        })}
      </div>

      {meals.length === 0 && (
        <Link
          href="/meals"
          className={
            buttonVariants({ variant: "outline", size: "sm" }) + "w-full"
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Plan Meals
        </Link>
      )}
    </section>
  );
}
