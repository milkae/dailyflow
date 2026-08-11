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

type Props = {
  recipes: RecipeGetPayload<{ include: { categories: true } }>[];
  selectedCategory?: string;
};

export function RecipeGrid({ recipes, selectedCategory }: Props) {
  if (!recipes.length && selectedCategory) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen className="h-10 w-10 text-tertiary" />
          </EmptyMedia>
          <EmptyTitle>No {selectedCategory} recipes</EmptyTitle>
          <EmptyDescription>
            You don&apos;t have any recipes in this category yet.
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
          <EmptyTitle> No recipes yet</EmptyTitle>
          <EmptyDescription>
            Start building your recipe collection
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateRecipeDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
    </ItemGroup>
  );
}
