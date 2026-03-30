import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitsOverview } from "@/components/habits/HabitsOverview";
import { HabitsStats } from "@/components/habits/HabitsStats";
import { HabitForm } from "@/components/HabitForm";
import prisma from "@/lib/prisma";
import { parseHabit } from "@/lib/habits";
import { Heading } from "@/components/ui/typography";
import { headers } from "next/headers";

export default async function HabitsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Heading>Habits</Heading>
          <p className="text-muted-foreground mt-2">
            Manage and track your {habits.length}{" "}
            {habits.length === 1 ? "habit" : "habits"}
          </p>
        </div>
        <HabitForm />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList variant="line" className="gap-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <HabitsOverview habits={typedHabits} />
        </TabsContent>

        <TabsContent value="stats">
          <HabitsStats habits={typedHabits} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
