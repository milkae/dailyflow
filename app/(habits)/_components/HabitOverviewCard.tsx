"use client";

import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Pencil, Calendar as CalendarIcon, Flame } from "lucide-react";
import { calculateStreak } from "@/utils/habits";
import { TypedHabitWithEntries } from "@/app/(habits)/types";
import { HabitForm } from "@/app/(habits)/_components/HabitForm";
import Link from "next/link";
import { DeleteHabitButton } from "./DeleteHabitButton";

export const HabitOverviewCard = ({
  habit,
}: {
  habit: TypedHabitWithEntries;
}) => {
  const streak = calculateStreak(habit);

  return (
    <Card className="p-5 hover:border-primary transition-all group h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link href={`/habits/${habit.id}`} className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {habit.description}
            </p>
          )}
        </Link>

        {streak > 0 && (
          <Badge
            variant="outline"
            className="shrink-0 bg-accent/10 text-accent border-accent/20"
          >
            <Flame className="h-3.5 w-3.5 mr-1" />
            {streak}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          <span>{habit.frequency}</span>
        </div>
        <span>•</span>
        <span>{habit.entries.length} entries</span>
      </div>

      <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <HabitForm
          habit={habit}
          trigger={
            <Button variant="outline" size="sm" className="flex-1">
              <Pencil className="h-3 w-3 mr-2" />
              Edit
            </Button>
          }
        />
        <DeleteHabitButton habit={habit} size="sm" />
      </div>
    </Card>
  );
};
