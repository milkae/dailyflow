import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RecipeGrid } from "@/components/RecipeGrid";
import { CreateRecipeButton } from "@/components/CreateRecipeButton";
import { BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { Heading } from "@/components/ui/typography";

export default async function RecipesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const recipes = await prisma.recipe.findMany({
    where: { userId: session.user.id },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-tertiary-muted p-2.5">
            <BookOpen className="h-6 w-6 text-tertiary" />
          </div>
          <div>
            <Heading>Recipes</Heading>
            <p className="text-muted-foreground mt-1">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} in
              your collection
            </p>
          </div>
        </div>
        <CreateRecipeButton />
      </div>

      {/* Grid */}
      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <div className="text-center py-16 rounded-lg border-2 border-dashed">
          <div className="rounded-full bg-tertiary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-10 w-10 text-tertiary" />
          </div>
          <Heading as="h3" className="text-xl mb-2">
            No recipes yet
          </Heading>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start building your recipe collection
          </p>
          <CreateRecipeButton />
        </div>
      )}
    </div>
  );
}
