import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateRecipe } from "@/lib/actions/recipe";
import { Loader2 } from "lucide-react";
import { Recipe } from "@/generated/prisma/browser";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

type Props = {
  recipe?: Recipe;
};

export function RecipeForm({ recipe }: Props) {
  const submitRecipe = createOrUpdateRecipe.bind(null, {
    id: recipe?.id,
  });
  const [state, formAction, pending] = useActionState(submitRecipe, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <form action={formAction} className="space-y-4 mt-4">
      <Field>
        <FieldLabel htmlFor="recipe-name">
          Recipe Name <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="recipe-name"
          name="name"
          required
          defaultValue={recipe?.name}
          placeholder="Peanut butter noodles"
          disabled={pending}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="recipe-description">
          Description{" "}
          <span className="text-muted-foreground text-sm font-normal">
            (optional)
          </span>
        </FieldLabel>
        <Textarea
          id="recipe-description"
          name="description"
          defaultValue={recipe?.description || ""}
          placeholder="Rich, creamy, savory, and spicy, they come together in under 20 minute"
          rows={2}
          disabled={pending}
          className="resize-none"
        />
      </Field>

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="prep-time">Prep (min)</FieldLabel>
          <Input
            id="prep-time"
            type="number"
            name="prep-time"
            defaultValue={recipe?.prepTime || ""}
            placeholder="15"
            disabled={pending}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="cook-time">Cook (min)</FieldLabel>
          <Input
            id="cook-time"
            type="number"
            name="cook-time"
            defaultValue={recipe?.cookTime || ""}
            placeholder="20"
            disabled={pending}
          />
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="ingredients">
          Ingredients{" "}
          <span className="text-muted-foreground text-sm font-normal">
            (one per line)
          </span>
        </FieldLabel>
        <Textarea
          id="ingredients"
          name="ingredients"
          defaultValue={recipe?.ingredients}
          placeholder="8oz noodles&#10;1/2 cup peanut butter&#10;3 Tbsp soy sauce&#10;1 Tbsp agave or maple syrup&#10;1 Tbsp white vinegar&#10;..."
          rows={6}
          disabled={pending}
          className="font-mono text-sm"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
        <Textarea
          id="instructions"
          name="instructions"
          defaultValue={recipe?.instructions}
          placeholder="1. Bring a large pot of water to boil. Cook the noodles according to package instructions.&#10;2. While the noobles cooks, whisk together the peanut butter sauce ingredients...&#10;..."
          rows={8}
          disabled={pending}
        />
      </Field>

      {recipe?.sourceUrl && (
        <div className="space-y-2">
          <FieldLabel>Source</FieldLabel>
          <a
            href={recipe?.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-violet-600 dark:text-violet-400 hover:underline truncate"
          >
            {recipe?.sourceUrl}
          </a>
        </div>
      )}

      {state.formErrors.map((e, i) => (
        <p
          aria-live="polite"
          key={i}
          className="rounded-lg bg-destructive-muted border-destructive/90 p-3 text-sm text-destructive-muted-foreground"
        >
          {e}
        </p>
      ))}

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving Recipe...
          </>
        ) : recipe?.id ? (
          "Update Recipe"
        ) : (
          "Save Recipe"
        )}
      </Button>
    </form>
  );
}
