import { CardsList } from "@/components/CardsList";
import { RecipeForm } from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const recipes = await prisma.recipe.findMany();

  return (
    <>
      <Heading className="text-center">My recipes</Heading>
      <RecipeForm />
      <CardsList>
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            {recipe.name}
            <div>{recipe.description}</div>
            <div>{recipe.ingredients}</div>
            <div>{recipe.instructions}</div>
          </Card>
        ))}
      </CardsList>
    </>
  );
}
