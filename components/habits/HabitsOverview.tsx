"use client";

import { TypedHabitWithEntries } from "@/lib/types";
import { HabitCard } from "./HabitCard";

export function HabitsOverview({
  habits,
}: {
  habits: TypedHabitWithEntries[];
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-3 capitalize">Habits</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          return <HabitCard habit={habit} key={habit.id} />;
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
