"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, MessageSquare, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { TypedHabitWithEntries } from "@/features/habits/types";
import { calculateStreak, getHabitEntryForToday } from "@/utils/habits";
import {
  toggleHabitCompletion,
  submitHabitEntryForm,
} from "@/features/habits/actions";
import { withCallbacks } from "@/utils/action-state";
import { Field } from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Input } from "@/components/ui/input";

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
  const [, formAction] = useActionState(
    withCallbacks(submitForm, { onSuccess: () => setDialogOpen(false) }),
    null,
  );

  return (
    <>
      <Item
        variant="outline"
        className={cn(
          "hover:shadow-sm",
          isCompleted
            ? "bg-success/5 border-success/30 hover:border-success/50 "
            : "bg-card/50 hover:border-primary/50 hover:bg-primary/5",
        )}
      >
        <ItemContent>
          <ItemTitle>
            <Link
              href={`/habits/${habit.id}`}
              className={cn(
                "font-medium truncate transition-colors flex-1 min-w-0",
                isCompleted
                  ? "line-through text-muted-foreground"
                  : "text-foreground group-hover/item:text-primary/10",
              )}
            >
              {habit.name}
            </Link>
          </ItemTitle>
          <ItemDescription>{habit.description}</ItemDescription>
        </ItemContent>
        <ItemContent>
          {streak > 0 && (
            <Badge
              variant="outline"
              className="shrink-0 bg-accent/10 text-accent border-accent/30 font-semibold"
            >
              <Flame className="h-3 w-3 mr-1" />
              {streak}
            </Badge>
          )}
        </ItemContent>
        <ItemActions>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setDialogOpen(true)}
            className={cn(hasNote && "text-primary hover:text-primary/50")}
          >
            <MessageSquare
              className={cn("size-4", hasNote && "fill-current")}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleHabitCompletion(habit.id, !isCompleted)}
            className={cn(
              "rounded-full border-2 bg-clip-border",
              "hover:scale-110 active:scale-95",
              isCompleted
                ? "bg-success border-success shadow-sm shadow-success/20 hover:bg-success dark:hover:bg-success"
                : "border-muted-foreground/40 hover:border-primary hover:bg-primary/5",
            )}
          >
            {isCompleted && <CheckCircle2 className="size-4" />}
          </Button>
        </ItemActions>
      </Item>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add note to {habit.name}</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <Field>
              <Input
                name="note"
                placeholder="How did it go? Any thoughts?"
                defaultValue={todayEntry?.note ?? undefined}
                className="min-h-25"
              />
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit">Save Note</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
