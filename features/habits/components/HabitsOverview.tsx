"use client";

import { TypedHabitWithEntries } from "@/features/habits/types";
import { HabitOverviewCard } from "./HabitOverviewCard";
import { Empty, EmptyDescription } from "@/components/ui/empty";

export function HabitsOverview({
  habits,
}: {
  habits: TypedHabitWithEntries[];
}) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          return <HabitOverviewCard habit={habit} key={habit.id} />;
        })}
      </div>

      {habits.length === 0 && (
        <Empty>
          <EmptyDescription>
            No habits yet. Create your first one to get started!
          </EmptyDescription>
        </Empty>
      )}
    </div>
  );
}
