"use client";

import { useActionState } from "react";
import { createOrUpdateRecipe } from "@/lib/actions";
import { TextInput } from "./TextInput";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Recipe } from "@/generated/prisma/browser";
import { Edit } from "lucide-react";

export const RecipeForm = ({ recipe }: { recipe?: Recipe }) => {
  const submitRecipe = createOrUpdateRecipe.bind(null, {
    id: recipe?.id,
  });
  const [state, formAction, pending] = useActionState(submitRecipe, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {recipe ? (
          <Button variant="outline" size="icon">
            <Edit />
          </Button>
        ) : (
          <Button variant="outline">
            <span>Create new recipe</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {recipe ? `Edit: ${recipe.name}` : "Create a new recipe"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction}>
          <FieldGroup>
            <TextInput
              name="name"
              defaultValue={recipe?.name}
              placeholder="Peanut butter noodles"
              required
              errors={state.fieldErrors.name}
            />
            <TextInput
              name="description"
              defaultValue={recipe?.description || ""}
              placeholder="Rich, creamy, savory, and spicy, they come together in under 20 minute"
              errors={state.fieldErrors.description}
            />
          </FieldGroup>
          <div className="space-y-2">
            <Label htmlFor="ingredients">
              Ingredients{" "}
              <span className="text-muted-foreground text-sm font-normal">
                (one per line)
              </span>
            </Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              defaultValue={recipe?.ingredients}
              placeholder="8oz noodles&#10;1/2 cup peanut butter&#10;3 Tbsp soy sauce&#10;1 Tbsp agave or maple syrup&#10;1 Tbsp white vinegar&#10;..."
              rows={6}
              disabled={pending}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              defaultValue={recipe?.instructions}
              placeholder="1. Bring a large pot of water to boil. Cook the noodles according to package instructions.&#10;2. While the noobles cooks, whisk together the peanut butter sauce ingredients...&#10;..."
              rows={8}
              disabled={pending}
            />
          </div>

          {state.formErrors.map((e, i) => (
            <p aria-live="polite" key={i}>
              {e}
            </p>
          ))}

          <DialogFooter className="flex justify-between gap-4">
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {recipe ? "Edit" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
