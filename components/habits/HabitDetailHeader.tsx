"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Flame, Calendar } from "lucide-react";
import { HabitForm } from "@/components/HabitForm";
import { calculateStreak } from "@/lib/habits";
import { TypedHabitWithEntries } from "@/lib/types";
import { Heading } from "../ui/typography";
import { DeleteHabitButton } from "./DeleteHabitButton";

export function HabitDetailHeader({ habit }: { habit: TypedHabitWithEntries }) {
  const streak = calculateStreak(habit);

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <Heading>{habit.name}</Heading>
          {streak > 0 && (
            <Badge className="bg-accent/10 text-accent border-accent/3 text-sm">
              <Flame data-icon="inline-start" />
              {`${streak} day streak`}
            </Badge>
          )}
        </div>

        {habit.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {habit.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{habit.frequency}</span>
          </div>
          <span>•</span>
          <span>{habit.entries.length} total entries</span>
          <span>•</span>
          <span>
            Started{" "}
            {new Date(habit.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <HabitForm
          habit={habit}
          trigger={
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          }
        />
        <DeleteHabitButton habit={habit} />
      </div>
    </div>
  );
}
