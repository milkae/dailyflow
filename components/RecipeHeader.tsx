"use client";

import { Recipe } from "@/generated/prisma/client";
import { Heading } from "./ui/typography";
import { RecipeForm } from "./RecipeForm";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/lib/actions";

export function RecipeHeader({ recipe }: { recipe: Recipe }) {
  return (
    <div>
      <Heading className="text-center">{recipe.name}</Heading>
      <p>{recipe.description}</p>
      <RecipeForm recipe={recipe} />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteRecipe(recipe.id)}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
