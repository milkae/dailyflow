"use client";

import { Recipe } from "@/generated/prisma/client";
import { RecipeSheet } from "./RecipeSheet";
import { useState } from "react";
import { RecipeItem } from "./RecipeItem";
import { ItemGroup } from "./ui/item";

export const RecipeList = ({ recipes }: { recipes: Recipe[] }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <ItemGroup className="max-w-xl flex-col gap-2">
        {recipes.map((recipe) => (
          <RecipeItem
            recipe={recipe}
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
          />
        ))}
      </ItemGroup>

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
