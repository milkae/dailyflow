"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath, updateTag } from "next/cache";
import { MealType } from "@/generated/prisma/enums";
import { verifySession } from "@/lib/dal";
import { MealWithRecipeName } from "@/app/(meals)/types";
import { normalizeDate } from "@/utils/date";
import { createMealSchema } from "@/lib/validators";
import { ActionState, Status } from "@/utils/action-state";

export async function addOrUpdateMeal(
  { date, type, id }: { date: Date; type: MealType; id?: string },
  _initialState: ActionState,
  formData: FormData,
) {
  const session = await verifySession();
  const normalizedDate = normalizeDate(date);
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = createMealSchema.safeParse({
    ...formDataObj,
    date,
    type,
  });

  if (!validatedFields.success) {
    return { ...z.flattenError(validatedFields.error), status: Status.ERROR };
  }

  const { name, notes, recipeId } = validatedFields.data;

  await prisma.meal.upsert({
    where: { id: id || "", userId: session.userId },
    update: { name, notes, recipeId },
    create: {
      name,
      notes,
      type,
      date: normalizedDate,
      userId: session.userId,
      recipeId,
    },
  });

  updateTag("dashboard");
  revalidatePath("/");
  revalidatePath("/meals");
  return { formErrors: [], fieldErrors: {}, status: Status.SUCCESS };
}

export async function deleteMeal(mealId: string) {
  const session = await verifySession();

  await prisma.meal.delete({
    where: { id: mealId, userId: session.userId },
  });

  updateTag("dashboard");
  revalidatePath("/");
  revalidatePath("/meals");
}

function getWeekBounds(today: Date) {
  const normalized = normalizeDate(today);

  const startOfWeek = new Date(normalized);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  return { startOfWeek, endOfWeek };
}

export const getWeekMeals = async () => {
  const session = await verifySession();
  const today = new Date();
  const { startOfWeek, endOfWeek } = getWeekBounds(today);

  return getWeekMealsCached(
    session.userId,
    startOfWeek.toISOString(),
    endOfWeek.toISOString(),
  );
};

const getWeekMealsCached = async (
  userId: string,
  startISO: string,
  endISO: string,
) => {
  "use cache";
  const meals = await prisma.meal.findMany({
    where: {
      userId,
      date: {
        gte: new Date(startISO),
        lt: new Date(endISO),
      },
    },
    include: { recipe: { select: { id: true, name: true } } },
    orderBy: [{ date: "desc" }, { type: "asc" }],
  });

  const emptyMeals = Object.values(MealType).reduce(
    (acc, type) => {
      acc[type] = null;
      return acc;
    },
    {} as Record<MealType, null>,
  );

  const mealsByDateAndType = meals.reduce(
    (acc, meal) => {
      const dateKey = new Date(meal.date).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { ...emptyMeals };
      }
      acc[dateKey][meal.type] = meal;
      return acc;
    },
    {} as Record<string, Record<MealType, MealWithRecipeName | null>>,
  );

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startISO);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];
    const mealsForDay = mealsByDateAndType[dateKey] || { ...emptyMeals };

    return { date, meals: mealsForDay };
  });
};

export type AddMealState = {
  success: boolean;
  error?: string;
};

export async function addRecipeToMealPlan(
  input: z.infer<typeof createMealSchema>,
): Promise<AddMealState> {
  const session = await verifySession();

  const result = createMealSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Invalid meal information.",
    };
  }

  const { recipeId, date, type, notes, name } = result.data;
  const normalizedDate = normalizeDate(date);

  // Make sure the recipe belongs to the current user.
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId: session.userId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!recipe) {
    return {
      success: false,
      error: "Recipe not found.",
    };
  }

  await prisma.meal.create({
    data: {
      name,
      type,
      date: normalizedDate,
      recipeId: recipe.id,
      notes: notes?.trim() || null,
      userId: session.userId,
    },
  });

  updateTag("dashboard");
  revalidatePath("/");
  revalidatePath("/meals");
  revalidatePath("/recipes");

  return {
    success: true,
  };
}
