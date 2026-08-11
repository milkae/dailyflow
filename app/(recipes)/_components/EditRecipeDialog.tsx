import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { RecipeForm } from "./RecipeForm";
import { RecipeGetPayload } from "@/generated/prisma/models";

type Props = {
  recipe: RecipeGetPayload<{ include: { categories: true } }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditRecipeDialog({ recipe, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>
        <RecipeForm recipe={recipe} />
      </DialogContent>
    </Dialog>
  );
}
