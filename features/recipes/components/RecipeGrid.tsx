"use client";

import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Link from "next/link";

type Recipe = {
  id: string;
  name: string;
  description: string | null;
  prepTime: number | null;
  cookTime: number | null;
};

type Props = {
  recipes: Recipe[];
};

export function RecipeGrid({ recipes }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          href={`/meals/recipes/${recipe.id}`}
          className="group"
        >
          <Card className="h-full hover:border-tertiary transition-all hover:shadow-lg">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold group-hover:text-tertiary transition-colors line-clamp-2 mb-2">
                  {recipe.name}
                </h3>

                {recipe.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {recipe.description}
                  </p>
                )}
              </div>
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
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
