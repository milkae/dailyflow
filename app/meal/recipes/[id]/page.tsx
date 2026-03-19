import { RecipeHeader } from "@/components/RecipeHeader";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
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

  return (
    <>
      <RecipeHeader recipe={recipe} />
      <div>
        <div>{recipe.ingredients}</div>
        <div>{recipe.instructions}</div>
      </div>
    </>
  );
}
