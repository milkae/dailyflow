import { useActionState, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addOrUpdateMeal } from "@/features/meals/actions";
import { Meal, Recipe } from "@/generated/prisma/client";
import { capitalize } from "@/utils/string";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { RecipeCombobox } from "../../recipes/components/RecipeCombobox";
import { CreateRecipeDialog } from "../../recipes/components/CreateRecipeDialog";
import { withCallbacks } from "@/utils/action-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: Date;
  existingMeal?: Meal;
  recipes?: Recipe[];
};

export function AddMealDialog({
  open,
  onOpenChange,
  mealType,
  date,
  existingMeal,
  recipes,
}: Props) {
  const submitMealForm = addOrUpdateMeal.bind(null, {
    date,
    type: mealType,
    id: existingMeal?.id,
  });
  const [state, formAction, pending] = useActionState(
    withCallbacks(submitMealForm, { onSuccess: () => onOpenChange(false) }),
    null,
  );
  const [selectedRecipeId, onSelectRecipe] = useState<string>(
    existingMeal?.recipeId || "",
  );
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="">
              {existingMeal ? "Edit" : "Add"} {capitalize(mealType)}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </DialogDescription>
          </DialogHeader>

          {state?.formErrors.map((e, i) => (
            <Alert
              variant="destructive"
              className="max-w-md"
              aria-live="polite"
              key={i}
            >
              <AlertCircleIcon />
              <AlertTitle>An Error Occured</AlertTitle>
              <AlertDescription>{e}</AlertDescription>
            </Alert>
          ))}

          <form
            action={async (formData) => {
              formData.append("recipeId", selectedRecipeId || "");
              formAction(formData);
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <Field data-invalid={!!state?.fieldErrors.name?.length}>
                <Input
                  name="name"
                  placeholder="Meal name"
                  defaultValue={existingMeal?.name}
                  required
                  disabled={pending}
                  aria-invalid={!!state?.fieldErrors.name?.length}
                />
                {!!state?.fieldErrors.name?.length && (
                  <FieldError
                    aria-live="polite"
                    errors={state.fieldErrors.name}
                  />
                )}
              </Field>
              <Field data-invalid={!!state?.fieldErrors.notes?.length}>
                <Textarea
                  name="notes"
                  defaultValue={existingMeal?.notes ?? ""}
                  placeholder="Add notes..."
                  disabled={pending}
                  aria-invalid={!!state?.fieldErrors.notes?.length}
                />
                {!!state?.fieldErrors.notes?.length && (
                  <FieldError
                    aria-live="polite"
                    className="text-sm text-destructive"
                    errors={state.fieldErrors.notes}
                  />
                )}
              </Field>
            </FieldGroup>
            {!!recipes?.length && (
              <RecipeCombobox
                recipes={recipes}
                selectedRecipeId={selectedRecipeId}
                onSelectRecipe={onSelectRecipe}
                onCreateNew={() => setIsRecipeDialogOpen(true)}
              />
            )}
            <div className="flex gap-2 pt-2">
              <DialogClose
                render={
                  <Button
                    variant="outline"
                    disabled={pending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                }
              />
              <Button
                type="submit"
                disabled={pending}
                className="flex-1 bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
              >
                {pending ? "Saving..." : existingMeal ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <CreateRecipeDialog
        open={isRecipeDialogOpen}
        onOpenChange={setIsRecipeDialogOpen}
      />
    </>
  );
}
