import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecipeGrid } from "@/app/(recipes)/_components/RecipeGrid";
import { CreateRecipeDialog } from "@/app/(recipes)/_components/CreateRecipeDialog";
import { BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import { Heading } from "@/app/_components/ui/typography";
import { headers } from "next/headers";
import { Metadata } from "next";
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
  const recipeWhere = category
    ? {
        categories: {
          some: {
            slug: category,
          },
        },
      }
    : undefined;

  const [recipes, totalRecipes] = await prisma.$transaction([
    prisma.recipe.findMany({
      where: recipeWhere,
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.recipe.count({
      where: recipeWhere,
    }),
  ]);
  const categories = await prisma.recipeCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const selectedCategory = categories.find((c) => c.slug === category);

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
              {totalRecipes} {totalRecipes === 1 ? "recipe" : "recipes"} in your
              collection
            </p>
          </div>
        </div>
        <CreateRecipeDialog />
      </div>
      <CategoryFilter categories={categories} selectedCategory={category} />
      <RecipeGrid recipes={recipes} selectedCategory={selectedCategory?.name} />
    </div>
  );
}
