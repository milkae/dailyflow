"use client";

import { Recipe } from "@/generated/prisma/client";
import { RecipeSheet } from "./RecipeSheet";
import { useState } from "react";
import { RecipeItem } from "./RecipeItem";

export const RecipeList = ({ recipes }: { recipes: Recipe[] }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {recipes.map((recipe) => (
        <RecipeItem
          recipe={recipe}
          key={recipe.id}
          onClick={() => setSelectedRecipe(recipe)}
        />
      ))}
      {selectedRecipe && (
        <RecipeSheet
          recipe={selectedRecipe}
          open={!!selectedRecipe}
          onOpenChange={(open) => !open && setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};
