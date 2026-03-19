import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Recipe } from "@/generated/prisma/client";
import Link from "next/link";

export function RecipeItem({ recipe }: { recipe: Recipe }) {
  return (
    <Item
      key={recipe.name}
      variant="outline"
      className="hover:bg-violet-50 dark:hover:bg-violet-950 hover:border-violet-500 dark:hover:border-violet-500"
      asChild
    >
      <Link href={`/meal/recipes/${recipe.id}`}>
        <ItemContent>
          <ItemTitle>{recipe.name}</ItemTitle>
          <ItemDescription>{recipe.description}</ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  );
}
