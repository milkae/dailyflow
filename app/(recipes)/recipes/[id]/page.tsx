import { notFound } from "next/navigation";
import { RecipeDetail } from "@/app/(recipes)/_components/RecipeDetail";
import { Metadata } from "next";
import { getRecipe } from "@/app/(recipes)/actions";

export async function generateMetadata(
  params: Promise<{ id: string }>,
): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id);

  return {
    title: recipe?.name,
    description: recipe?.description,
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return notFound();
  }

  return <RecipeDetail recipe={recipe} />;
}
