import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitsOverview } from "@/components/habits/HabitsOverview";
import { HabitsStats } from "@/components/habits/HabitsStats";
import { HabitForm } from "@/components/habits/HabitForm";
import { Heading } from "@/components/ui/typography";
import { getHabits } from "@/lib/actions/habit";

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
