"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { ActionState, Status } from "@/utils/action-state";
import { cache } from "react";
import { logError } from "@/lib/logger";
import { deleteRecipeImage, uploadExternalImage } from "@/app/(recipes)/image";
import { RecipeCreateWithoutUserInput } from "@/generated/prisma/models";

export async function createOrUpdateRecipe(
  { id }: { id?: string },
  _initialState: ActionState,
  recipe: RecipeCreateWithoutUserInput,
) {
  const session = await verifySession();

  const existing = id
    ? await prisma.recipe.findUnique({
        where: { id, userId: session.userId },
      })
    : null;

  if (id && !existing) {
    return {
      formErrors: ["Recipe not found"],
      fieldErrors: {},
      status: Status.ERROR,
    };
  }

  if (recipe.imageUrl?.startsWith("http")) {
    recipe.imageUrl = await uploadExternalImage(recipe.imageUrl);
  }

  try {
    if (existing) {
      await prisma.recipe.update({
        where: { id, userId: session.userId },
        data: recipe,
      });

      if (existing.imageUrl && existing.imageUrl !== recipe.imageUrl) {
        await deleteRecipeImage(existing.imageUrl);
      }

      revalidatePath(`/recipes/${id}`);
      revalidatePath("/recipes");
      return { formErrors: [], fieldErrors: {}, status: Status.SUCCESS };
    }

    if (recipe.sourceUrl) {
      const existingBySource = await prisma.recipe.findFirst({
        where: { sourceUrl: recipe.sourceUrl, userId: session.userId },
      });

      if (existingBySource) {
        await prisma.recipe.update({
          where: { id: existingBySource.id, userId: session.userId },
          data: recipe,
        });
        if (
          existingBySource.imageUrl &&
          existingBySource.imageUrl !== recipe.imageUrl
        ) {
          await deleteRecipeImage(existingBySource.imageUrl);
        }
        revalidatePath("/recipes");
        return { formErrors: [], fieldErrors: {}, status: Status.SUCCESS };
      }
    }

    await prisma.recipe.create({
      data: { ...recipe, userId: session.userId },
    });

    revalidatePath("/recipes");
    return { formErrors: [], fieldErrors: {}, status: Status.SUCCESS };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logError(error, "Recipe save error");
    return {
      formErrors: ["Failed to save recipe. Please try again."],
      fieldErrors: {},
      status: Status.ERROR,
    };
  }
}

export async function deleteRecipe(recipeId: string) {
  const session = await verifySession();
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: session.userId },
  });

  if (!recipe) {
    throw new Error("Unauthorized");
  }

  await prisma.recipe.delete({
    where: { id: recipeId, userId: session.userId },
  });
  if (recipe.imageUrl) {
    await deleteRecipeImage(recipe.imageUrl);
  }
  revalidatePath("/recipes");
}

export async function getAllRecipes() {
  const session = await verifySession();
  return prisma.recipe.findMany({ where: { userId: session.userId } });
}

export const getRecipe = cache(async (id: string) => {
  const session = await verifySession();
  if (id) {
    const recipe = await prisma.recipe.findUnique({
      where: { id, userId: session.userId },
    });

    return recipe;
  }
});
