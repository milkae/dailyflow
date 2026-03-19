import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateRecipe } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { Recipe } from "@/generated/prisma/browser";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: Recipe;
};

export function RecipeFormDialog({ open, onOpenChange, recipe }: Props) {
  const submitRecipe = createOrUpdateRecipe.bind(null, {
    id: recipe?.id,
  });
  const [state, formAction, pending] = useActionState(submitRecipe, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="recipe-name">
              Recipe Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recipe-name"
              name="name"
              required
              defaultValue={recipe?.name}
              placeholder="Peanut butter noodles"
              disabled={pending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipe-description">
              Description{" "}
              <span className="text-muted-foreground text-sm font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="recipe-description"
              name="description"
              defaultValue={recipe?.description || ""}
              placeholder="Rich, creamy, savory, and spicy, they come together in under 20 minute"
              rows={2}
              disabled={pending}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prep-time">Prep (min)</Label>
              <Input
                id="prep-time"
                type="number"
                name="prep-time"
                defaultValue={recipe?.prepTime || ""}
                placeholder="15"
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cook-time">Cook (min)</Label>
              <Input
                id="cook-time"
                type="number"
                name="cook-time"
                defaultValue={recipe?.cookTime || ""}
                placeholder="20"
                disabled={pending}
              />
            </div>
          </div>

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
            <p
              aria-live="polite"
              key={i}
              className="rounded-lg bg-destructive-muted border-destructive/90 p-3 text-sm text-destructive-muted-foreground"
            >
              {e}
            </p>
          ))}

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
              className="flex-1 bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : recipe ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
