"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toggleHabitCompletion, submitHabitEntryForm } from "@/lib/actions";
import { calculateStreak, getHabitEntryForToday } from "@/lib/habits";
import { TypedHabitWithEntries } from "@/lib/types";
import { TextInput } from "../TextInput";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  habit: TypedHabitWithEntries;
};

export function HabitCheckInCard({ habit }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const todayEntry = getHabitEntryForToday(habit);
  const isCompleted = !!todayEntry;
  const hasNote = !!todayEntry?.note;
  const streak = calculateStreak(habit);

  const submitForm = submitHabitEntryForm.bind(null, habit.id);

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 p-3 rounded-lg border transition-all",
          isCompleted
            ? "bg-success/5 border-success/20 hover:border-success/40"
            : "bg-card border-border hover:border-primary/40 hover:bg-accent/5",
        )}
      >
        <button
          onClick={() => toggleHabitCompletion(habit.id, !isCompleted)}
          className={cn(
            "shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
            isCompleted
              ? "bg-success border-success"
              : "border-muted-foreground/30 hover:border-primary",
          )}
        >
          {isCompleted && (
            <CheckCircle2 className="h-4 w-4 text-success-foreground" />
          )}
        </button>

        <Link
          href={`/habits/${habit.id}`}
          className="flex-1 min-w-0 group/link"
        >
          <p
            className={cn(
              "font-medium truncate transition-colors group-hover/link:text-primary",
              isCompleted && "line-through text-muted-foreground",
            )}
          >
            {habit.name}
          </p>
        </Link>

        {streak > 0 && (
          <Badge
            variant="outline"
            className="shrink-0 bg-accent/10 text-accent border-accent/20 text-xs"
          >
            <Flame className="h-3 w-3 mr-1" />
            {streak}
          </Badge>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setDialogOpen(true)}
          className={cn("shrink-0 h-8 w-8 p-0", hasNote && "text-primary")}
        >
          <MessageSquare className={cn("h-4 w-4", hasNote && "fill-current")} />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add note to {habit.name}</DialogTitle>
          </DialogHeader>
          <form action={submitForm} className="space-y-4">
            <TextInput
              name="note"
              placeholder="How did it go? Any thoughts?"
              defaultValue={todayEntry?.note ?? undefined}
              className="min-h-25"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={() => setDialogOpen(false)}>
                Save Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
