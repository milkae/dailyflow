import { RecipeForm } from "@/components/RecipeForm";
import { RecipeList } from "@/components/RecipeList";
import { Heading } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const recipes = await prisma.recipe.findMany();

  return (
    <>
      <Heading className="text-center">My recipes</Heading>
      <RecipeForm />
      <RecipeList recipes={recipes} />
    </>
  );
}
