import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, CalendarFold } from "lucide-react";
import Link from "next/link";
import { HabitCheckInCard } from "@/components/habits/HabitCheckInCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { buttonVariants } from "@/lib/utils";
import { Heading } from "../ui/typography";
import { getTodayHabits } from "@/lib/dashboard-data";

export async function TodayHabits() {
  const habits = await getTodayHabits();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading as="h2" className="text-2xl font-bold">
          Habits
        </Heading>
        <div className="flex items-center gap-2">
          <HabitForm
            trigger={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            }
          />
          <Link
            href="/habits"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>

      {habits.length > 0 ? (
        <div className="space-y-2">
          {habits.map((habit) => (
            <HabitCheckInCard key={habit.id} habit={habit} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border-2 border-dashed bg-muted/20 p-12 text-center">
      <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <CalendarFold className="h-8 w-8 text-primary" />
      </div>
      <Heading as="h3" className="text-lg mb-2">
        No habits for today
      </Heading>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        Create your first habit to start tracking your progress
      </p>
      <HabitForm
        trigger={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Habit
          </Button>
        }
      />
    </div>
  );
}
