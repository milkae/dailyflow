import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Recipe } from "@/generated/prisma/browser";
import { RecipeForm } from "./RecipeForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: Recipe;
};

export function EditRecipeDialog({ open, onOpenChange, recipe }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
        </DialogHeader>
        <RecipeForm recipe={recipe} />
      </DialogContent>
    </Dialog>
  );
}
