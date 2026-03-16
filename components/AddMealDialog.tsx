import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addOrUpdateMeal } from "@/lib/actions";
import { TextInput } from "./TextInput";
import { Meal } from "@/generated/prisma/client";
import { capitalize } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: Date;
  existingMeal?: Meal;
};

export function AddMealDialog({
  open,
  onOpenChange,
  mealType,
  date,
  existingMeal,
}: Props) {
  const submitMealForm = addOrUpdateMeal.bind(null, {
    date,
    type: mealType,
    id: existingMeal?.id,
  });
  const [state, formAction, pending] = useActionState(submitMealForm, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">
            {existingMeal ? "Edit" : "Add"} {capitalize(mealType)}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await formAction(formData);
            onOpenChange(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <TextInput
              name="name"
              placeholder="Meal name"
              defaultValue={existingMeal?.name}
              required
              disabled={pending}
              errors={state.fieldErrors.name}
            />
            <Field data-invalid={!!state.fieldErrors.notes?.length}>
              <Textarea
                name="notes"
                defaultValue={existingMeal?.notes ?? ""}
                placeholder="Add notes..."
                disabled={pending}
                aria-invalid={!!state.fieldErrors.notes?.length}
                className={cn(
                  "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
                  "focus:border-emerald-500 dark:focus:border-emerald-500  focus:ring-emerald-500 dark:focus:ring-emerald-500",
                  {
                    "border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500 dark:focus:border-red-500 dark:focus:ring-red-500":
                      !!state.fieldErrors.notes?.length,
                  },
                )}
              />
              {!!state.fieldErrors.notes?.length && (
                <div>
                  {state.fieldErrors.notes.map((e, i) => (
                    <FieldError
                      aria-live="polite"
                      key={i}
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      {e}
                    </FieldError>
                  ))}
                </div>
              )}
            </Field>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
            >
              {pending ? "Saving..." : existingMeal ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
