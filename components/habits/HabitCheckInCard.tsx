"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TypedHabitWithEntries } from "@/lib/types";
import { calculateStreak, getHabitEntryForToday } from "@/lib/habits";
import {
  toggleHabitCompletion,
  submitHabitEntryForm,
} from "@/lib/actions/habit";
import { TextInput } from "../TextInput";

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
          "group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
          isCompleted
            ? "bg-success/5 border-success/30 hover:border-success/50 hover:shadow-sm"
            : "bg-card/50 border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
        )}
      >
        <button
          onClick={() => toggleHabitCompletion(habit.id, !isCompleted)}
          className={cn(
            "shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
            "hover:scale-110 active:scale-95",
            isCompleted
              ? "bg-success border-success shadow-sm shadow-success/20"
              : "border-muted-foreground/40 hover:border-primary hover:bg-primary/5",
          )}
        >
          {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
        </button>

        <Link href={`/habits/${habit.id}`} className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium truncate transition-colors",
              isCompleted
                ? "line-through text-muted-foreground"
                : "text-foreground group-hover:text-primary",
            )}
          >
            {habit.name}
          </p>
        </Link>

        {streak > 0 && (
          <Badge
            variant="outline"
            className="shrink-0 bg-accent/10 text-accent border-accent/30 px-2 py-0.5 text-xs font-semibold"
          >
            <Flame className="h-3 w-3 mr-1" />
            {streak}
          </Badge>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setDialogOpen(true)}
          className={cn(
            "shrink-0 h-8 w-8 p-0 hover:bg-primary/10",
            hasNote && "text-primary bg-primary/5",
          )}
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
