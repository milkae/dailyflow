"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { MealType } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cache } from "react";
import { verifySession } from "@/lib/dal";
import { MealWithRecipeName } from "../types";

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
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = mealSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return z.flattenError(validatedFields.error);
  }

  const { name, notes, recipeId } = validatedFields.data;

  await prisma.meal.upsert({
    where: { id: id || "", userId: session.user.id },
    update: { name, notes, recipeId },
    create: {
      name,
      notes,
      type,
      date: dateOnly,
      userId: session.user.id,
      recipeId,
    },
  });

  revalidatePath("/");
  revalidatePath("/meals");
  return { formErrors: [], fieldErrors: {} };
}

export async function deleteMeal(mealId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  await prisma.meal.delete({
    where: { id: mealId, userId: session.user.id },
  });

  revalidatePath("/");
  revalidatePath("/meals");
}

export const getWeekMeals = cache(async () => {
  const session = await verifySession();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const meals = await prisma.meal.findMany({
    where: {
      userId: session.userId,
      date: { gte: startOfWeek, lt: endOfWeek },
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
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];
    const meals = mealsByDateAndType[dateKey] || { ...emptyMeals };

    return { date, meals };
  });
});
