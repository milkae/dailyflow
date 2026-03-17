"use client";

import { useActionState } from "react";
import { createRecipe } from "@/lib/actions";
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

export const RecipeForm = () => {
  const [state, formAction, pending] = useActionState(createRecipe, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span>Create new recipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new recipe</DialogTitle>
        </DialogHeader>

        <form action={formAction}>
          <FieldGroup>
            <TextInput
              name="name"
              placeholder="Peanut butter noodles"
              required
              errors={state.fieldErrors.name}
            />
            <TextInput
              name="description"
              placeholder="Rich, creamy, savory, and spicy, they come together in under 20 minute"
              errors={state.fieldErrors.description}
            />
          </FieldGroup>
          <div className="space-y-2">
            <Label htmlFor="ingredients">
              Ingredients{" "}
              <span className="text-slate-500 text-sm font-normal">
                (one per line)
              </span>
            </Label>
            <Textarea
              id="ingredients"
              name="ingredients"
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
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
