import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitsOverview } from "@/features/habits/components/HabitsOverview";
import { HabitsStats } from "@/features/habits/components/HabitsStats";
import { HabitForm } from "@/features/habits/components/HabitForm";
import { Heading } from "@/components/ui/typography";
import { getHabits } from "@/features/habits/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habits",
  description:
    "Manage habits, track progress, and stay consistent with DailyFlow habit tools.",
};

export default async function HabitsPage() {
  const habits = await getHabits();

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
          <HabitsOverview habits={habits} />
        </TabsContent>

        <TabsContent value="stats">
          <HabitsStats habits={habits} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
