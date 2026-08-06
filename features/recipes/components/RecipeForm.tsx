import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateRecipe } from "@/features/recipes/actions";
import { AlertCircleIcon, ExternalLink, Loader2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { withCallbacks } from "@/utils/action-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { RecipeImageField } from "./RecipeImageField";
import { ParsedRecipe } from "../types";
import { useRecipeImageUpload } from "../hooks";
import { Recipe } from "@/generated/prisma/client";

type Props = {
  recipe?: Recipe;
  parsedRecipe?: ParsedRecipe;
  onSuccess?: () => void;
};

export function RecipeForm({ recipe, parsedRecipe, onSuccess }: Props) {
  const submitRecipe = createOrUpdateRecipe.bind(null, {
    id: recipe?.id,
  });

  const [state, formAction, actionPending] = useActionState(
    withCallbacks(submitRecipe, {
      onSuccess: () => {
        onSuccess?.();
        toast.success(
          recipe
            ? "Recipe updated successfully!"
            : "Recipe created successfully!",
        );
      },
      onError: () => {
        toast.error("Failed to save recipe. Please try again.");
      },
    }),
    null,
  );
  const { upload, uploadProgress, uploading, uploadError } =
    useRecipeImageUpload();

  const [isTransitionPending, startTransition] = useTransition();

  const pending = actionPending || isTransitionPending || uploading;
  const defaults = recipe || parsedRecipe;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("imageFile") as File | null;
    formData.delete("imageFile");

    const imageKey =
      file && file.size ? await upload(file) : defaults?.imageUrl;
    formData.set("imageUrl", imageKey || "");

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Field data-invalid={!!state?.fieldErrors.name?.length}>
        <FieldLabel htmlFor="recipe-name">
          Recipe Name <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="recipe-name"
          name="name"
          required
          defaultValue={defaults?.name}
          placeholder="Peanut butter noodles"
          disabled={pending}
        />
        {!!state?.fieldErrors.name?.length && (
          <FieldError aria-live="polite" errors={state.fieldErrors.name} />
        )}
      </Field>

      <Field data-invalid={!!state?.fieldErrors.description?.length}>
        <FieldLabel htmlFor="recipe-description">
          Description{" "}
          <span className="text-muted-foreground text-sm font-normal">
            (optional)
          </span>
        </FieldLabel>
        <Textarea
          id="recipe-description"
          name="description"
          defaultValue={defaults?.description || ""}
          placeholder="Rich, creamy, savory, and spicy, they come together in under 20 minute"
          rows={2}
          disabled={pending}
          className="resize-none"
          aria-invalid={!!state?.fieldErrors.description?.length}
        />
        {!!state?.fieldErrors.description?.length && (
          <FieldError
            aria-live="polite"
            errors={state.fieldErrors.description}
          />
        )}
      </Field>

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!state?.fieldErrors.prepTime?.length}>
          <FieldLabel htmlFor="prep-time">Prep (min)</FieldLabel>
          <Input
            id="prep-time"
            type="number"
            name="prepTime"
            defaultValue={defaults?.prepTime || ""}
            placeholder="15"
            disabled={pending}
          />
          {!!state?.fieldErrors.prepTime?.length && (
            <FieldError
              aria-live="polite"
              errors={state.fieldErrors.prepTime}
            />
          )}
        </Field>
        <Field data-invalid={!!state?.fieldErrors.cookTime?.length}>
          <FieldLabel htmlFor="cook-time">Cook (min)</FieldLabel>
          <Input
            id="cook-time"
            type="number"
            name="cookTime"
            defaultValue={defaults?.cookTime || ""}
            placeholder="20"
            disabled={pending}
          />
          {!!state?.fieldErrors.cookTime?.length && (
            <FieldError
              aria-live="polite"
              errors={state.fieldErrors.cookTime}
            />
          )}
        </Field>
        <Field data-invalid={!!state?.fieldErrors.servings?.length}>
          <FieldLabel htmlFor="servings">Servings</FieldLabel>
          <Input
            id="servings"
            type="number"
            name="servings"
            defaultValue={defaults?.servings || ""}
            placeholder="4"
            disabled={pending}
          />
        </Field>
        {!!state?.fieldErrors.servings?.length && (
          <FieldError aria-live="polite" errors={state.fieldErrors.servings} />
        )}
        <Field data-invalid={!!state?.fieldErrors.category?.length}>
          <FieldLabel htmlFor="servings">Category</FieldLabel>
          <Input
            id="category"
            type="string"
            name="category"
            defaultValue={defaults?.category || ""}
            placeholder=""
            disabled={pending}
          />
        </Field>
        {!!state?.fieldErrors.category?.length && (
          <FieldError aria-live="polite" errors={state.fieldErrors.category} />
        )}
      </FieldGroup>

      <Field data-invalid={!!state?.fieldErrors.ingredients?.length}>
        <FieldLabel htmlFor="ingredients">
          Ingredients{" "}
          <span className="text-muted-foreground text-sm font-normal">
            (one per line)
          </span>
        </FieldLabel>
        <Textarea
          id="ingredients"
          name="ingredients"
          defaultValue={defaults?.ingredients}
          placeholder="8oz noodles&#10;1/2 cup peanut butter&#10;3 Tbsp soy sauce&#10;1 Tbsp agave or maple syrup&#10;1 Tbsp white vinegar&#10;..."
          rows={6}
          disabled={pending}
          className="font-mono text-sm"
        />
        {!!state?.fieldErrors.ingredients?.length && (
          <FieldError
            aria-live="polite"
            errors={state.fieldErrors.ingredients}
          />
        )}
      </Field>

      <Field data-invalid={!!state?.fieldErrors.instructions?.length}>
        <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
        <Textarea
          id="instructions"
          name="instructions"
          defaultValue={defaults?.instructions}
          placeholder="1. Bring a large pot of water to boil. Cook the noodles according to package instructions.&#10;2. While the noobles cooks, whisk together the peanut butter sauce ingredients...&#10;..."
          rows={8}
          disabled={pending}
        />
        {!!state?.fieldErrors.instructions?.length && (
          <FieldError
            aria-live="polite"
            errors={state.fieldErrors.instructions}
          />
        )}
      </Field>

      <div className="space-y-2">
        <Field data-invalid={!!state?.fieldErrors.sourceUrl?.length}>
          <FieldLabel htmlFor="sourceUrl">
            Source
            {defaults?.sourceUrl && (
              <a
                href={defaults?.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-tertiary hover:underline"
              >
                <span>Open link</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </FieldLabel>

          <Input
            id="sourceUrl"
            name="sourceUrl"
            defaultValue={defaults?.sourceUrl || ""}
            disabled={pending}
          />
          {!!state?.fieldErrors.sourceUrl?.length && (
            <FieldError
              aria-live="polite"
              errors={state.fieldErrors.sourceUrl}
            />
          )}
        </Field>
      </div>
      <div className="space-y-2">
        <RecipeImageField
          existingImageUrl={defaults?.imageUrl}
          disabled={pending}
          serverErrors={
            uploadError ? [uploadError] : state?.fieldErrors.imageUrl
          }
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
      >
        {uploading && uploadProgress !== null ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading image... {uploadProgress}%
          </>
        ) : pending ? (
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
