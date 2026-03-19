"use client";

import { Recipe } from "@/generated/prisma/client";
import { RecipeItem } from "./RecipeItem";
import { ItemGroup } from "./ui/item";

export const RecipeList = ({ recipes }: { recipes: Recipe[] }) => {
  return (
    <div className="flex flex-col gap-2">
      <ItemGroup className="max-w-xl flex-col gap-2">
        {recipes.map((recipe) => (
          <RecipeItem recipe={recipe} key={recipe.id} />
        ))}
      </ItemGroup>
    </div>
  );
};
