"use client";

import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateStreak } from "@/lib/habits";
import { TypedHabitWithEntries } from "@/lib/types";
import Link from "next/link";

export const StreakLeaderboard = ({
  habits,
}: {
  habits: TypedHabitWithEntries[];
}) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No habits yet</p>
      </div>
    );
  }

  const sortedHabits = habits
    .map((h) => ({
      ...h,
      streak: calculateStreak(h),
    }))
    .filter(({ streak }) => streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  if (sortedHabits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No habits with streaks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedHabits.map((habit, index) => (
        <Link
          key={habit.id}
          href={`/habits/${habit.id}`}
          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-primary hover:bg-accent/5 transition-all group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold text-muted-foreground">
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate group-hover:text-primary transition-colors">
              {habit.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {habit.entries.length} total entries
            </p>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 bg-accent/10 text-accent border-accent/20"
          >
            <Flame className="h-3.5 w-3.5 mr-1" />
            <span className="font-bold">{habit.streak}</span>
            <span className="ml-1 text-xs">days</span>
          </Badge>
        </Link>
      ))}
    </div>
  );
};
