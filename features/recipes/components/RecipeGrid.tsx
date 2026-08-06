"use client";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/generated/prisma/client";
import { getRecipeImageUrl } from "@/lib/recipe-image";

type Props = {
  recipes: Recipe[];
};

export function RecipeGrid({ recipes }: Props) {
  return (
    <ItemGroup className="grid grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <Link key={recipe.id} href={`/meals/recipes/${recipe.id}`}>
          <Item variant="outline">
            <ItemHeader>
              <Image
                src={getRecipeImageUrl(recipe.imageUrl) || "/placehorder.png"}
                alt={recipe.name}
                width={128}
                height={128}
                className="aspect-square w-full rounded-sm object-cover"
              />
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{recipe.name}</ItemTitle>
              <ItemDescription>{recipe.description}</ItemDescription>
              {!!(recipe.prepTime || recipe.cookTime) && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {!!recipe.prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Prep: {recipe.prepTime}min</span>
                    </div>
                  )}
                  {!!recipe.cookTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Cook: {recipe.cookTime}min</span>
                    </div>
                  )}
                </div>
              )}
            </ItemContent>
          </Item>
        </Link>
      ))}
    </ItemGroup>
  );
}
