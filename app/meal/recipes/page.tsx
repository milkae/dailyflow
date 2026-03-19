import { prisma } from "@/lib/prisma";
import { RecipeGrid } from "@/components/RecipeGrid";
import { CreateRecipeButton } from "@/components/CreateRecipeButton";
import { BookOpen } from "lucide-react";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      prepTime: true,
      cookTime: true,
      createdAt: true,
    },
  });

  return (
    <main className="container py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="text-muted-foreground mt-1">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} saved
          </p>
        </div>

        <CreateRecipeButton />
      </div>
      {recipes.length > 0 ? <RecipeGrid recipes={recipes} /> : <EmptyRecipes />}
    </main>
  );
}

function EmptyRecipes() {
  return (
    <div className="text-center py-16">
      <div className="rounded-full bg-tertiary-muted w-20 h-20 flex items-center justify-center mx-auto mb-4">
        <BookOpen className="h-10 w-10 text-tertiary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start building your recipe collection. Save your favorites or create
        your own.
      </p>
      <CreateRecipeButton />
    </div>
  );
}
