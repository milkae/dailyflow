import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Heading } from "@/components/ui/typography";
import { buttonVariants } from "@/lib/utils";

export default async function MealsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Get current week's meals
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const meals = await prisma.meal.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startOfWeek, lt: endOfWeek },
    },
    include: { recipe: true },
    orderBy: [{ date: "asc" }, { type: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Weekly meals plan</Heading>
          <p className="text-muted-foreground mt-1">
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
      <WeeklyMealPlanner meals={meals} />
    </div>
  );
}
