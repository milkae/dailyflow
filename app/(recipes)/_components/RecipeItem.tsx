"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "@/app/_components/ui/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Recipe } from "@/generated/prisma/client";
import { getRecipeImageUrl } from "@/lib/recipe-image";
import { RecipeGetPayload } from "@/generated/prisma/models";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { EditRecipeDialog } from "./EditRecipeDialog";
import { DeleteRecipeDialog } from "./DeleteRecipeDialog";
import { useState } from "react";

type Props = { recipe: RecipeGetPayload<{ include: { categories: true } }> };

function getTotalTime(recipe: Recipe) {
  return (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
}

export function RecipeItem({ recipe }: Props) {
  const totalTime = getTotalTime(recipe);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <Item
        variant="outline"
        className="group relative h-full overflow-hidden p-0 transition-shadow hover:shadow-md"
      >
        <ItemHeader className="relative p-0">
          <Link
            href={`/recipes/${recipe.id}`}
            className="block aspect-4/3 w-full overflow-hidden"
          >
            <Image
              src={getRecipeImageUrl(recipe.imageUrl) || "/placeholder.png"}
              alt={recipe.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          {recipe.categories[0] && (
            <Badge variant="secondary" className="absolute left-3 top-3">
              {recipe.categories[0].name}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="absolute right-3 top-3"
              aria-label={`Actions for ${recipe.name}`}
              render={
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="rounded-full"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Pencil /> Edit recipe
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 /> Delete recipe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemHeader>
        <Link href={`/recipes/${recipe.id}`} className="block">
          <ItemContent className="gap-2 p-4">
            <ItemTitle className="line-clamp-2 text-base font-semibold">
              {recipe.name}
            </ItemTitle>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              {totalTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> {totalTime} min
                </span>
              )}
              <span>{recipe.servings} servings</span>
            </div>
          </ItemContent>
        </Link>
      </Item>
      <EditRecipeDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        recipe={recipe}
      />
      <DeleteRecipeDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        recipe={recipe}
      />
    </>
  );
}
