"use client";

import {
  Flame,
  Trash2,
  Circle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Habit, Entry } from "@/generated/prisma/client";
import {
  deleteHabit,
  toggleHabitCompletion,
  submitHabitEntryForm,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { calculateStreaks, getHabitEntryForToday } from "@/lib/habits";
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
import { TextInput } from "./TextInput";

export const HabitCard = ({
  habit,
}: {
  habit: Habit & { entries: Entry[] };
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const todayEntry = getHabitEntryForToday(habit);
  const isCompletedToday = !!todayEntry;
  const entryNote = todayEntry?.note;
  const submitForm = submitHabitEntryForm.bind(null, habit.id);
  const streak = calculateStreaks(habit);

  return (
    <Card className="group p-6 space-y-4 hover:border-primary transition-all flex flex-col">
      <div className="flex-1 flex items-start justify-between gap-3">
        <Link
          href={`/habits/${habit.id}`}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {habit.description}
            </p>
          )}
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          {streak > 0 && (
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Flame className="text-accent" data-icon="inline-start" />
              <span className="text-xs font-bold">{streak}</span>
            </Badge>
          )}
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
        </div>
      </div>
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
