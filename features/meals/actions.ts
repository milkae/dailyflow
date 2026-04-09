"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { MealType } from "@/generated/prisma/enums";
import { verifySession } from "@/lib/dal";
import { MealWithRecipeName } from "@/features/meals/types";
import { normalizeDate } from "@/utils/date";

const mealSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  notes: z.string().optional(),
  recipeId: z.string().optional(),
});

export async function addOrUpdateMeal(
  { date, type, id }: { date: Date; type: MealType; id?: string },
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
  },
  formData: FormData,
) {
  const session = await verifySession();
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = mealSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return z.flattenError(validatedFields.error);
  }

  const { name, notes, recipeId } = validatedFields.data;

  await prisma.meal.upsert({
    where: { id: id || "", userId: session.userId },
    update: { name, notes, recipeId },
    create: {
      name,
      notes,
      type,
      date: dateOnly,
      userId: session.userId,
      recipeId,
    },
  });

  revalidatePath("/");
  revalidatePath("/meals");
  return { formErrors: [], fieldErrors: {} };
}

export async function deleteMeal(mealId: string) {
  const session = await verifySession();

  await prisma.meal.delete({
    where: { id: mealId, userId: session.userId },
  });

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
