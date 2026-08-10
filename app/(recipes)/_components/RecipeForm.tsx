import { useActionState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { createOrUpdateRecipe } from "@/app/(recipes)/actions";
import { AlertCircleIcon, ExternalLink, Loader2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { withCallbacks } from "@/utils/action-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { toast } from "sonner";
import { RecipeImageField } from "./RecipeImageField";
import { useQuery } from "@tanstack/react-query";
import { RecipeCategoryMultiSelect } from "./RecipeCategoryMultiSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { RecipeGetPayload } from "@/generated/prisma/models";
import { ParsedRecipe } from "@/app/api/recipes/parse/route";
import { RecipeCategory } from "@/generated/prisma/client";

type Props = {
  recipe?: RecipeGetPayload<{ include: { categories: true } }>;
  parsedRecipe?: ParsedRecipe;
  onSuccess?: () => void;
};

const formSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).nullish(),
  ingredients: z.string().min(1, "Ingredients required"),
  instructions: z.string().min(1, "Instructions required"),
  prepTime: z.number().int().min(0).nullish(),
  cookTime: z.number().int().min(0).nullish(),
  servings: z.number().int().min(1).default(4).optional(),
  sourceUrl: z.string().nullish(),
  categoryIds: z.array(z.string()).default([]).optional(),
  imageUrl: z.string().nullish(),
});

export type FormRecipe = z.infer<typeof formSchema>;

export function RecipeForm({ recipe, parsedRecipe, onSuccess }: Props) {
  const { data: categories } = useQuery({
    queryKey: ["recipeCategories"],
    queryFn: async (): Promise<RecipeCategory[]> => {
      const response = await fetch("/api/recipes/categories");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json();
    },
  });

  const initialCategoryIds =
    parsedRecipe?.categories
      .map((slug) => categories?.find((category) => category.slug === slug)?.id)
      .filter((id): id is string => Boolean(id)) ||
    recipe?.categories.map(({ id }) => id);

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

  const defaults = recipe || parsedRecipe;

  const form = useForm<FormRecipe>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaults, categoryIds: initialCategoryIds },
  });

  return (
    <form onSubmit={form.handleSubmit(formAction)} className="space-y-4">
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
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="recipe-name">
              Recipe Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="recipe-name"
              placeholder="Peanut butter noodles"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <FieldError
                aria-live="polite"
                errors={[fieldState.error?.message]}
              />
            )}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="recipe-description">
              Description{" "}
              <span className="text-muted-foreground text-sm font-normal">
                (optional)
              </span>
            </FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              id="recipe-description"
              placeholder="Rich, creamy, savory, and spicy, they come together in under 20 minute"
              rows={2}
              className="resize-none"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <FieldError
                aria-live="polite"
                errors={[fieldState.error?.message]}
              />
            )}
          </Field>
        )}
      />
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="prepTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="prep-time">Prep (min)</FieldLabel>
              <Input
                {...field}
                value={field.value ?? undefined}
                id="prep-time"
                name="prepTime"
                placeholder="15"
              />
              {fieldState.invalid && (
                <FieldError
                  aria-live="polite"
                  errors={[fieldState.error?.message]}
                />
              )}
            </Field>
          )}
        />
        <Controller
          name="cookTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cook-time">Cook (min)</FieldLabel>
              <Input
                {...field}
                value={field.value ?? undefined}
                id="cook-time"
                placeholder="20"
              />
              {fieldState.invalid && (
                <FieldError
                  aria-live="polite"
                  errors={[fieldState.error?.message]}
                />
              )}
            </Field>
          )}
        />
        <Controller
          name="servings"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="servings">Servings</FieldLabel>
              <Input {...field} id="servings" placeholder="4" />
              {fieldState.invalid && (
                <FieldError
                  aria-live="polite"
                  errors={[fieldState.error?.message]}
                />
              )}
            </Field>
          )}
        />
        <div>
          <p>Parsed categories</p>
          {parsedRecipe?.categories.map((c, i) => (
            <p key={i}>{c}</p>
          ))}
          {parsedRecipe?.sourceCategory && (
            <p>Source category: {parsedRecipe.sourceCategory}</p>
          )}
        </div>

        <Controller
          name="categoryIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="servings">Category</FieldLabel>
              <RecipeCategoryMultiSelect
                {...field}
                categories={categories || []}
              />
              {fieldState.invalid && (
                <FieldError
                  aria-live="polite"
                  errors={[fieldState.error?.message]}
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Controller
        name="ingredients"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="ingredients">
              Ingredients{" "}
              <span className="text-muted-foreground text-sm font-normal">
                (one per line)
              </span>
            </FieldLabel>
            <Textarea
              {...field}
              id="ingredients"
              placeholder="8oz noodles&#10;1/2 cup peanut butter&#10;3 Tbsp soy sauce&#10;1 Tbsp agave or maple syrup&#10;1 Tbsp white vinegar&#10;..."
              rows={6}
              className="font-mono text-sm"
            />
            {fieldState.invalid && (
              <FieldError
                aria-live="polite"
                errors={[fieldState.error?.message]}
              />
            )}
          </Field>
        )}
      />
      <Controller
        name="instructions"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
            <Textarea
              {...field}
              id="instructions"
              placeholder="1. Bring a large pot of water to boil. Cook the noodles according to package instructions.&#10;2. While the noobles cooks, whisk together the peanut butter sauce ingredients...&#10;..."
              rows={8}
            />
            {fieldState.invalid && (
              <FieldError
                aria-live="polite"
                errors={[fieldState.error?.message]}
              />
            )}
          </Field>
        )}
      />
      <div className="space-y-2">
        <Controller
          name="sourceUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sourceUrl">
                Source
                {field.value && (
                  <a
                    href={field.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-tertiary hover:underline"
                  >
                    <span>Open link</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </FieldLabel>

              <Input {...field} value={field.value ?? ""} id="sourceUrl" />
              {fieldState.invalid && (
                <FieldError
                  aria-live="polite"
                  errors={[fieldState.error?.message]}
                />
              )}
            </Field>
          )}
        />
      </div>
      <div className="space-y-2">
        <Controller
          name="imageUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <RecipeImageField
              existingImageUrl={defaults?.imageUrl}
              disabled={actionPending}
              formErrors={
                fieldState.invalid && fieldState.error?.message
                  ? [fieldState.error?.message]
                  : undefined
              }
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={actionPending}
        className="w-full bg-tertiary hover:bg-tertiary/90 text-tertiary-foreground"
      >
        {actionPending ? (
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
