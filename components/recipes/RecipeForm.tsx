import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateRecipe } from "@/lib/actions/recipe";
import { Loader2 } from "lucide-react";
import { Recipe } from "@/generated/prisma/browser";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

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
      <Field data-invalid={!!state.fieldErrors.name?.length}>
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
        {!!state.fieldErrors.name?.length && (
          <div>
            {state.fieldErrors.name.map((e, i) => (
              <FieldError
                aria-live="polite"
                key={i}
                className="text-sm text-destructive"
              >
                {e}
              </FieldError>
            ))}
          </div>
        )}
      </Field>

      <Field data-invalid={!!state.fieldErrors.description?.length}>
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
        {!!state.fieldErrors.description?.length && (
          <div>
            {state.fieldErrors.description.map((e, i) => (
              <FieldError
                aria-live="polite"
                key={i}
                className="text-sm text-destructive"
              >
                {e}
              </FieldError>
            ))}
          </div>
        )}
      </Field>

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!state.fieldErrors.prepTime?.length}>
          <FieldLabel htmlFor="prep-time">Prep (min)</FieldLabel>
          <Input
            id="prep-time"
            type="number"
            name="prepTime"
            defaultValue={recipe?.prepTime || ""}
            placeholder="15"
            disabled={pending}
          />
          {!!state.fieldErrors.prepTime?.length && (
            <div>
              {state.fieldErrors.prepTime.map((e, i) => (
                <FieldError
                  aria-live="polite"
                  key={i}
                  className="text-sm text-destructive"
                >
                  {e}
                </FieldError>
              ))}
            </div>
          )}
        </Field>
        <Field data-invalid={!!state.fieldErrors.cookTime?.length}>
          <FieldLabel htmlFor="cook-time">Cook (min)</FieldLabel>
          <Input
            id="cook-time"
            type="number"
            name="cookTime"
            defaultValue={recipe?.cookTime || ""}
            placeholder="20"
            disabled={pending}
          />
          {!!state.fieldErrors.cookTime?.length && (
            <div>
              {state.fieldErrors.cookTime.map((e, i) => (
                <FieldError
                  aria-live="polite"
                  key={i}
                  className="text-sm text-destructive"
                >
                  {e}
                </FieldError>
              ))}
            </div>
          )}
        </Field>
        <Field data-invalid={!!state.fieldErrors.servings?.length}>
          <FieldLabel htmlFor="servings">Servings</FieldLabel>
          <Input
            id="servings"
            type="number"
            name="servings"
            defaultValue={recipe?.servings || ""}
            placeholder="4"
            disabled={pending}
          />
        </Field>
        {!!state.fieldErrors.servings?.length && (
          <div>
            {state.fieldErrors.servings.map((e, i) => (
              <FieldError
                aria-live="polite"
                key={i}
                className="text-sm text-destructive"
              >
                {e}
              </FieldError>
            ))}
          </div>
        )}
      </FieldGroup>

      <Field data-invalid={!!state.fieldErrors.ingredients?.length}>
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
        {!!state.fieldErrors.ingredients?.length && (
          <div>
            {state.fieldErrors.ingredients.map((e, i) => (
              <FieldError
                aria-live="polite"
                key={i}
                className="text-sm text-destructive"
              >
                {e}
              </FieldError>
            ))}
          </div>
        )}
      </Field>

      <Field data-invalid={!!state.fieldErrors.instructions?.length}>
        <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
        <Textarea
          id="instructions"
          name="instructions"
          defaultValue={recipe?.instructions}
          placeholder="1. Bring a large pot of water to boil. Cook the noodles according to package instructions.&#10;2. While the noobles cooks, whisk together the peanut butter sauce ingredients...&#10;..."
          rows={8}
          disabled={pending}
        />
        {!!state.fieldErrors.instructions?.length && (
          <div>
            {state.fieldErrors.instructions.map((e, i) => (
              <FieldError
                aria-live="polite"
                key={i}
                className="text-sm text-destructive"
              >
                {e}
              </FieldError>
            ))}
          </div>
        )}
      </Field>

      {recipe?.sourceUrl && (
        <div className="space-y-2">
          <Field data-invalid={!!state.fieldErrors.sourceUrl?.length}>
            <FieldLabel htmlFor="sourceUrl">Source</FieldLabel>
            <Input
              id="sourceUrl"
              name="sourceUrl"
              defaultValue={recipe?.sourceUrl}
              disabled={pending}
            />
            <a
              href={recipe?.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-violet-600 dark:text-violet-400 hover:underline truncate"
            >
              {recipe?.sourceUrl}
            </a>
            {!!state.fieldErrors.sourceUrl?.length && (
              <div>
                {state.fieldErrors.sourceUrl.map((e, i) => (
                  <FieldError
                    aria-live="polite"
                    key={i}
                    className="text-sm text-destructive"
                  >
                    {e}
                  </FieldError>
                ))}
              </div>
            )}
          </Field>
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
