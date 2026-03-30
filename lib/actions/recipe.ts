"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const recipeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  ingredients: z.string(),
  instructions: z.string(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  sourceUrl: z.string().optional(),
});

export async function createOrUpdateRecipe(
  { id }: { id?: string },
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
  },
  formData: FormData,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = recipeSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return z.flattenError(validatedFields.error);
  }

  const {
    name,
    description,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    sourceUrl,
  } = validatedFields.data;

  try {
    if (id) {
      const existing = await prisma.recipe.findUnique({
        where: { id, userId: session.user.id },
      });

      if (!existing) {
        return {
          formErrors: ["Recipe not found"],
          fieldErrors: {},
        };
      }

      await prisma.recipe.update({
        where: { id, userId: session.user.id },
        data: {
          name,
          description,
          ingredients,
          instructions,
          prepTime,
          cookTime,
          sourceUrl,
        },
      });

      revalidatePath(`/meal/recipes/${id}`);
    } else {
      await prisma.recipe.create({
        data: {
          name,
          description,
          ingredients,
          instructions,
          prepTime,
          cookTime,
          sourceUrl,
          userId: session.user.id,
        },
      });
    }

    revalidatePath("/meal/recipes");
    return { formErrors: [], fieldErrors: {} };
  } catch (error) {
    console.error("Recipe save error:", error);
    return {
      formErrors: ["Failed to save recipe. Please try again."],
      fieldErrors: {},
    };
  }
}

export async function deleteRecipe(recipeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, userId: session.user.id },
  });

  if (!recipe) {
    throw new Error("Unauthorized");
  }

  await prisma.recipe.delete({
    where: { id: recipeId, userId: session.user.id },
  });

  revalidatePath("/meal/recipes");
}
