import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecipeGrid } from "@/features/recipes/components/RecipeGrid";
import { CreateRecipeDialog } from "@/features/recipes/components/CreateRecipeDialog";
import { BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { Heading } from "@/components/ui/typography";
import { headers } from "next/headers";
import { Metadata } from "next";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Browse, create, and manage your personal recipe collection in DailyFlow.",
};

export default async function RecipesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

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
        <CreateRecipeDialog />
      </div>

      {/* Grid */}
      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
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
      )}
    </div>
  );
}
