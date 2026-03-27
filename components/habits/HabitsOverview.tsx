"use client";

import { TypedHabitWithEntries } from "@/lib/types";
import { HabitOverviewCard } from "./HabitOverviewCard";

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
        <div className="text-center py-12 text-muted-foreground">
          <p>No habits yet. Create your first one to get started!</p>
        </div>
      )}
    </div>
  );
}
