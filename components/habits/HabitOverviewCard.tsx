"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar as CalendarIcon, Flame } from "lucide-react";
import { calculateStreak } from "@/lib/habits";
import { deleteHabit } from "@/lib/actions";
import { TypedHabitWithEntries } from "@/lib/types";
import { HabitForm } from "@/components/HabitForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const HabitOverviewCard = ({
  habit,
}: {
  habit: TypedHabitWithEntries;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const streak = calculateStreak(habit);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteHabit(habit.id);
    router.refresh();
  };

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
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="text-destructive hover:bg-destructive-muted"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2 />
              </AlertDialogMedia>
              <AlertDialogTitle>{`Delete "${habit.name}"?`}</AlertDialogTitle>
              <AlertDialogDescription>
                {`This will permanently delete "${habit.name}". This cannot be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
