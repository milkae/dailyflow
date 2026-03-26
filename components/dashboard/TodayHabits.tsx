"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TypedHabitWithEntries } from "@/lib/types";
import { HabitCard } from "../habits/HabitCard";
import { HabitForm } from "../HabitForm";
import { buttonVariants } from "@/lib/utils";
import { Heading } from "../ui/typography";

export function TodayHabits({ habits }: { habits: TypedHabitWithEntries[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Heading as="h2">Today&apos;s Habits</Heading>
        <Link
          href="/habits"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          View All
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>

      {habits.length > 0 ? (
        <div className="space-y-3">
          {habits.slice(0, 5).map((habit) => (
            <HabitCard key={habit.id} habit={habit} compact />
          ))}
          {habits.length > 5 && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              +{habits.length - 5} more habits
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No habits for today</p>
          <HabitForm
            trigger={
              <Button size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Habit
              </Button>
            }
          />
        </div>
      )}
    </Card>
  );
}
