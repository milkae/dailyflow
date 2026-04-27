import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, CalendarFold } from "lucide-react";
import Link from "next/link";
import { HabitCheckInCard } from "@/features/habits/components/HabitCheckInCard";
import { HabitForm } from "@/features/habits/components/HabitForm";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { Heading } from "../../../components/ui/typography";
import { TypedHabitWithEntries } from "@/features/habits/types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function TodayHabits({ habits }: { habits: TypedHabitWithEntries[] }) {
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
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarFold className="h-8 w-8 text-primary" />
        </EmptyMedia>
        <EmptyTitle>No habits for today</EmptyTitle>
        <EmptyDescription>
          Create your first habit to start tracking your progress
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <HabitForm
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Habit
            </Button>
          }
        />
      </EmptyContent>
    </Empty>
  );
}
