import {
  Item,
  ItemContent,
  ItemDescription,
  ItemActions,
  ItemTitle,
} from "@/components/ui/item";
import { Recipe } from "@/generated/prisma/client";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/lib/actions";
import { RecipeForm } from "./RecipeForm";

export function RecipeItem({
  recipe,
  onClick,
}: {
  recipe: Recipe;
  onClick: () => void;
}) {
  return (
    <Item
      key={recipe.name}
      variant="outline"
      className="group hover:border-violet-500 dark:hover:border-violet-500"
    >
      <ItemContent onClick={onClick}>
        <ItemTitle>{recipe.name}</ItemTitle>
        <ItemDescription>{recipe.description}</ItemDescription>
      </ItemContent>
      <ItemActions className="opacity-0 group-hover:opacity-100 transition-opacity">
        <RecipeForm recipe={recipe} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteRecipe(recipe.id)}
        >
          <Trash2 />
        </Button>
      </ItemActions>
    </Item>
  );
}
