import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Recipe } from "@/generated/prisma/client";

export function RecipeItem({
  recipe,
  onClick,
}: {
  recipe: Recipe;
  onClick: () => void;
}) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6" onClick={onClick}>
      <ItemGroup>
        <Item key={recipe.name} variant="outline">
          <ItemContent>
            <ItemTitle>{recipe.name}</ItemTitle>
            <ItemDescription>{recipe.description}</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  );
}
