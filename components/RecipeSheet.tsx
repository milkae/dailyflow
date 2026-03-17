import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Recipe } from "@/generated/prisma/client";

export function RecipeSheet({
  recipe,
  open,
  onOpenChange,
}: {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{recipe.name}</SheetTitle>
          <SheetDescription>{recipe.description} </SheetDescription>
        </SheetHeader>
        <div>
          <div>{recipe.ingredients}</div>
          <div>{recipe.instructions}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
