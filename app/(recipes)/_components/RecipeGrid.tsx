"use client";

import { ItemGroup } from "@/app/_components/ui/item";

import { RecipeGetPayload } from "@/generated/prisma/models";
import { RecipeItem } from "./RecipeItem";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/_components/ui/empty";
import { BookOpen } from "lucide-react";
import { CreateRecipeDialog } from "./CreateRecipeDialog";
import { useState } from "react";
import { AddToMealPlanDialog } from "@/app/(meals)/_components/AddToMealPlanDialog";
import { EditRecipeDialog } from "./EditRecipeDialog";
import { DeleteRecipeDialog } from "./DeleteRecipeDialog";

type Props = {
  recipes: RecipeGetPayload<{ include: { categories: true } }>[];
  selectedCategory?: string;
};

export function RecipeGrid({ recipes, selectedCategory }: Props) {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeGetPayload<{
    include: { categories: true };
  }> | null>(null);
  const [dialog, setDialog] = useState<"edit" | "delete" | "meal-plan" | null>(
    null,
  );

  if (!recipes.length && selectedCategory) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen className="h-10 w-10 text-tertiary" />
          </EmptyMedia>
          <EmptyTitle>No {selectedCategory} recipes</EmptyTitle>
          <EmptyDescription>
            Add a recipe in this category to plan meals faster.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (!recipes.length) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen className="h-10 w-10 text-tertiary" />
          </EmptyMedia>
          <EmptyTitle>No recipes yet</EmptyTitle>
          <EmptyDescription>
            Start building your recipe collection to simplify meal planning.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateRecipeDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeItem
            key={recipe.id}
            recipe={recipe}
            onEdit={() => {
              setSelectedRecipe(recipe);
              setDialog("edit");
            }}
            onDelete={() => {
              setSelectedRecipe(recipe);
              setDialog("delete");
            }}
            onAddToMealPlan={() => {
              setSelectedRecipe(recipe);
              setDialog("meal-plan");
            }}
          />
        ))}
      </ItemGroup>
      {!!selectedRecipe && (
        <>
          <EditRecipeDialog
            recipe={selectedRecipe}
            open={!!selectedRecipe && dialog === "edit"}
            onOpenChange={(open: boolean) => {
              if (!open) {
                setSelectedRecipe(null);
                setDialog(null);
              }
            }}
          />
          <DeleteRecipeDialog
            recipe={selectedRecipe}
            open={!!selectedRecipe && dialog === "delete"}
            onOpenChange={(open: boolean) => {
              if (!open) {
                setSelectedRecipe(null);
                setDialog(null);
              }
            }}
          />
          <AddToMealPlanDialog
            recipe={selectedRecipe}
            open={!!selectedRecipe && dialog === "meal-plan"}
            onOpenChangeAction={(open: boolean) => {
              if (!open) {
                setSelectedRecipe(null);
                setDialog(null);
              }
            }}
          />
        </>
      )}
    </>
  );
}
