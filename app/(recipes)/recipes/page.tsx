import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecipeGrid } from "@/app/(recipes)/_components/RecipeGrid";
import { CreateRecipeDialog } from "@/app/(recipes)/_components/CreateRecipeDialog";
import { BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { Heading } from "@/app/_components/ui/typography";
import { headers } from "next/headers";
import { Metadata } from "next";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/_components/ui/empty";
import { CategoryFilter } from "../_components/CategoryFilter";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Browse, create, and manage your personal recipe collection in DailyFlow.",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { category } = await searchParams;
  const recipes = await prisma.recipe.findMany({
    where: category
      ? {
          categories: {
            some: {
              slug: category,
            },
          },
        }
      : undefined,
    include: {
      categories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.recipeCategory.findMany({
    orderBy: {
      name: "asc",
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
      <CategoryFilter categories={categories} selectedCategory={category} />
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
