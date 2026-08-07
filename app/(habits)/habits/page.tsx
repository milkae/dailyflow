import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { HabitsOverview } from "@/app/(habits)/_components/HabitsOverview";
import { HabitsStats } from "@/app/(habits)/_components/HabitsStats";
import { HabitForm } from "@/app/(habits)/_components/HabitForm";
import { Heading } from "@/app/_components/ui/typography";
import { getHabits } from "@/app/(habits)/actions";
import { Metadata } from "next";
import { ErrorBoundary } from "@/app/_components/shared/error-boundary";

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
          <ErrorBoundary
            title="Habits Overview Error"
            description="Failed to load your habits overview."
          >
            <HabitsOverview habits={habits} />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="stats">
          <ErrorBoundary
            title="Habits Stats Error"
            description="Failed to load your habits statistics."
          >
            <HabitsStats habits={habits} />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
