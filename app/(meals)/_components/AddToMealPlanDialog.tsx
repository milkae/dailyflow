"use client";

import { useState, useTransition } from "react";
import { CalendarDays, Loader2 } from "lucide-react";

import { addRecipeToMealPlan } from "@/app/(meals)/actions";
import { MealType, Recipe } from "@/generated/prisma/browser";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";

type Props = {
  recipe: Recipe;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

const mealTypes = [
  {
    value: MealType.BREAKFAST,
    label: "Breakfast",
  },
  {
    value: MealType.LUNCH,
    label: "Lunch",
  },
  {
    value: MealType.DINNER,
    label: "Dinner",
  },
  {
    value: MealType.SNACK,
    label: "Snack",
  },
];

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  // Format local calendar date for <input type="date"> to avoid UTC day shifts.
  return `${year}-${month}-${day}`;
}

export function AddToMealPlanDialog({
  recipe,
  open,
  onOpenChangeAction,
}: Props) {
  const [date, setDate] = useState(getToday);
  const [type, setType] = useState<MealType>(MealType.DINNER);
  const [notes, setNotes] = useState("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    startTransition(async () => {
      const result = await addRecipeToMealPlan({
        name: recipe.name,
        recipeId: recipe.id,
        date: new Date(date),
        type,
        notes,
      });

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      onOpenChangeAction(false);
      setNotes("");
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to meal plan</DialogTitle>

          <DialogDescription>
            Add <strong>{recipe.name}</strong> to your weekly meal plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="meal-date">Date</Label>

            <div className="relative">
              <Input
                id="meal-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={isPending}
                className="pr-10"
                required
              />

              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Meal type */}
          <div className="space-y-2">
            <Label>Meal</Label>

            <Select
              value={type}
              onValueChange={(value) => setType(value as MealType)}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {mealTypes.map((meal) => (
                  <SelectItem key={meal.value} value={meal.value}>
                    {meal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="meal-notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>

            <Textarea
              id="meal-notes"
              placeholder="Anything you want to remember..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={isPending}
              maxLength={500}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeAction(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Add to plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
