"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  ChefHat,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { EditRecipeDialog } from "@/features/recipes/components/EditRecipeDialog";
import { deleteRecipe } from "@/features/recipes/actions";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Recipe } from "@/generated/prisma/browser";
import { buttonVariants } from "@/components/ui/buttonVariants";

type Props = {
  recipe: Recipe;
};

export function RecipeDetail({ recipe }: Props) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteRecipe(recipe.id);
    router.push("/meals/recipes");
    router.refresh();
  };

  const ingredientsList = recipe.ingredients
    .split("\n")
    .filter((line) => line.trim());

  const instructionsList = recipe.instructions
    .split("\n")
    .filter((line) => line.trim());

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <>
      <main className="py-8 max-w-4xl space-y-6 m-auto">
        <Link
          href="/meals/recipes"
          className={buttonVariants({ variant: "ghost" })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to recipes
        </Link>

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
              {recipe.description && (
                <p className="text-lg text-muted-foreground">
                  {recipe.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className=" text-destructive hover:bg-destructive-muted"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Time info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {!!recipe.prepTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Prep: <strong>{recipe.prepTime} min</strong>
                </span>
              </div>
            )}
            {!!recipe.cookTime && (
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                <span>
                  Cook: <strong>{recipe.cookTime} min</strong>
                </span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Total: <strong>{totalTime} min</strong>
                </span>
              </div>
            )}
            {recipe.sourceUrl && (
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-tertiary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Original recipe</span>
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
          {/* Ingredients */}
          <Card className="h-fit">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {ingredientsList.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="rounded-full bg-tertiary-muted text-tertiary-muted-foreground w-6 h-6 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Instructions */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {instructionsList.map((instruction, index) => (
                  <li key={index} className="flex gap-4 text-muted-foreground">
                    <span className="rounded-full bg-tertiary w-8 h-8 flex items-center justify-center text-sm font-bold text-tertiary-foreground shrink-0">
                      {index + 1}
                    </span>
                    <p className="pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </div>
      </main>

      {/* Edit Dialog */}
      <EditRecipeDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        recipe={recipe}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to delete ${recipe.name}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
