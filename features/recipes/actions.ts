"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { logError } from "@/lib/logger";
import { createRecipeSchema } from "@/lib/validators";
import { ActionState, Status } from "@/utils/action-state";

export async function createOrUpdateRecipe(
  { id }: { id?: string },
  _initialState: ActionState,
  formData: FormData,
) {
  const session = await verifySession();
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = createRecipeSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return { ...z.flattenError(validatedFields.error), status: Status.ERROR };
  }

  const recipe = validatedFields.data;

  try {
    if (id) {
      const existing = await prisma.recipe.findUnique({
        where: { id, userId: session.userId },
      });

      if (!existing) {
        return {
          formErrors: ["Recipe not found"],
          fieldErrors: {},
          status: Status.ERROR,
        };
      }

      await prisma.recipe.update({
        where: { id, userId: session.userId },
        data: recipe,
      });

      revalidatePath(`/meals/recipes/${id}`);
    } else {
      if (recipe.sourceUrl) {
        const existing = await prisma.recipe.findFirst({
          where: { sourceUrl: recipe.sourceUrl, userId: session.userId },
        });
        if (existing) {
          await prisma.recipe.update({
            where: { id: existing.id, userId: session.userId },
            data: recipe,
          });
          revalidatePath(`/meals/recipes`);
          return { formErrors: [], fieldErrors: {}, status: Status.SUCCESS };
        }
      }

      await prisma.recipe.create({
        data: {
          ...recipe,
          userId: session.userId,
        },
      });
    }

    revalidatePath("/meals/recipes");
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

  revalidatePath("/meals/recipes");
}

export async function getAllRecipes() {
  const session = await verifySession();
  return prisma.recipe.findMany({ where: { userId: session.userId } });
}
