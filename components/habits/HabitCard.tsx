"use client";

import {
  Flame,
  Trash2,
  Circle,
  CheckCircle2,
  MessageSquare,
  CalendarIcon,
  Pencil,
} from "lucide-react";
import {
  deleteHabit,
  toggleHabitCompletion,
  submitHabitEntryForm,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { calculateStreak, getHabitEntryForToday } from "@/lib/habits";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TextInput } from "../TextInput";
import { TypedHabitWithEntries } from "@/lib/types";
import { Heading } from "../ui/typography";
import { HabitForm } from "../HabitForm";

export const HabitCard = ({
  habit,
  compact,
}: {
  habit: TypedHabitWithEntries;
  compact?: boolean;
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const todayEntry = getHabitEntryForToday(habit);
  const isCompletedToday = !!todayEntry;
  const entryNote = todayEntry?.note;
  const submitForm = submitHabitEntryForm.bind(null, habit.id);
  const streak = calculateStreak(habit);

  return (
    <Card className="group p-4 space-y-3 hover:border-primary transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link
            href={`/habits/${habit.id}`}
            // className="flex-1 min-w-0 cursor-pointer"
          >
            <Heading
              as="h3"
              className="group-hover:text-primary transition-colors line-clamp-1"
            >
              {habit.name}
            </Heading>
          </Link>
          {habit.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {habit.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {streak > 0 && (
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Flame data-icon="inline-start" />
              <span>{streak}</span>
            </Badge>
          )}
          {!!compact && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive-muted dark:hover:bg-destructive-muted opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                deleteHabit(habit.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {!compact && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <span>{habit.frequency}</span>
          <span>•</span>
          <span>{habit.entries.length} entries</span>
        </div>
      )}

      {!!compact ? (
        <div className="flex gap-2 mt-auto">
          <Button
            onClick={() => toggleHabitCompletion(habit.id, !isCompletedToday)}
            className={cn("flex-1", {
              "border-primary bg-primary/10 text-primary hover:bg-primary/20":
                isCompletedToday,
              "border-2 border-border bg-card text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary":
                !isCompletedToday,
            })}
          >
            {isCompletedToday ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Done today
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 mr-2" />
                Mark as done
              </>
            )}
          </Button>
          <Button
            size="icon"
            onClick={() => setDialogOpen(true)}
            title={entryNote ? "Edit Note" : "Add note"}
            className={cn({
              "border-primary bg-primary/10 text-primary hover:bg-primary/20":
                entryNote,
              "border-2 border-border bg-card text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary":
                !entryNote,
            })}
          >
            <MessageSquare
              className={cn(`h-4 w-4`, { "fill-current": entryNote })}
            />
          </Button>
        </div>
      ) : (
        <div className="mt-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <HabitForm
            habit={habit}
            trigger={
              <Button variant="outline" size="sm" className="flex-1">
                <Pencil className="h-3 w-3 mr-2" />
                Edit
              </Button>
            }
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteHabit(habit.id)}
            className="text-destructive hover:bg-destructive-muted dark:hover:bg-destructive-muted"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save daily entry</DialogTitle>
          </DialogHeader>
          <form action={submitForm} className="flex flex-col gap-4">
            <TextInput
              name="note"
              placeholder="Add a note to the entry"
              defaultValue={entryNote ?? undefined}
            />
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Close</Button>} />
              <DialogClose
                render={<Button type="submit">Mark as done</Button>}
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
