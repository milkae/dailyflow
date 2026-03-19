import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RecipeDetail } from "@/components/RecipeDetail";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    return notFound();
  }

  return <RecipeDetail recipe={recipe} />;
}
