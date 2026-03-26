import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitsOverview } from "@/components/habits/HabitsOverview";
import { HabitsStats } from "@/components/habits/HabitsStats";
import { HabitForm } from "@/components/HabitForm";
import prisma from "@/lib/prisma";
import { parseHabit } from "@/lib/habits";
import { Heading } from "@/components/ui/typography";

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const typedHabits = habits.map(parseHabit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <Heading>Habits</Heading>
          <p className="text-muted-foreground mt-1">
            Manage and track your {habits.length}{" "}
            {habits.length === 1 ? "habit" : "habits"}
          </p>
        </div>
        <HabitForm />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <HabitsOverview habits={typedHabits} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <HabitsStats habits={typedHabits} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
