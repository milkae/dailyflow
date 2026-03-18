"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Frequency, MealType } from "@/generated/prisma/enums";

const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const habitSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string("Invalid description").optional(),
  frequency: z.enum(Frequency).optional(),
  config: z.string().optional(),
});

const getFrequencyConfig = (
  frequency?: Frequency,
  config?: number | number[],
) => {
  switch (frequency) {
    case Frequency.DAILY:
      return null;
    case Frequency.WEEKLY:
      return { day: config };
    case Frequency.INTERVAL:
      return { interval: config };
    case Frequency.SPECIFIC_DAYS:
      return { days: config };
    case Frequency.MONTHLY:
      return { day: config };
  }
};

export async function createHabit(
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
    success: boolean;
  },
  formData: FormData,
) {
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = habitSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return { ...z.flattenError(validatedFields.error), success: false };
  }

  const { name, description, frequency, config } = validatedFields.data;
  const frequencyConfig =
    getFrequencyConfig(frequency, config ? JSON.parse(config) : null) || {};

  await prisma.habit.create({
    data: { name, description, frequency, frequencyConfig },
  });

  revalidatePath("/");
  return { formErrors: [], fieldErrors: {}, success: true };
}

export async function submitHabitEntryForm(id: string, formData: FormData) {
  const note = (formData.get("note") as string) || "";
  await createHabitEntry(id, undefined, note);
}

export async function createHabitEntry(
  id: string,
  date = new Date(),
  note?: string,
) {
  const entryDate = normalizeDate(date);

  const existingEntry = await prisma.entry.findUnique({
    where: { habitId_date: { habitId: id, date: entryDate } },
  });

  if (existingEntry && existingEntry.note === note) {
    return;
  }

  await prisma.entry.upsert({
    where: { habitId_date: { habitId: id, date: entryDate } },
    update: { note },
    create: { habitId: id, date: entryDate, note },
  });

  revalidatePath("/");
}

export async function deleteHabitEntry(id: string, date = new Date()) {
  const entryDate = normalizeDate(date);

  await prisma.entry.deleteMany({
    where: { habitId: id, date: entryDate },
  });
  revalidatePath("/");
}

export async function toggleHabitCompletion(id: string, completion: boolean) {
  if (!completion) {
    return deleteHabitEntry(id);
  }

  return createHabitEntry(id);
}

export async function getLastMonthHabits() {
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const habits = await prisma.habit.findMany({
    include: {
      entries: {
        where: {
          date: { gte: previousMonth },
        },
      },
    },
  });

  return habits;
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  revalidatePath("/");
}

const mealSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  notes: z.string().optional(),
});

export async function addOrUpdateMeal(
  { date, type, id }: { date: Date; type: MealType; id?: string },
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
  },
  formData: FormData,
) {
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = mealSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return z.flattenError(validatedFields.error);
  }

  const { name, notes } = validatedFields.data;

  await prisma.meal.upsert({
    where: { id: id || "" },
    update: { name, notes },
    create: {
      name,
      notes,
      type,
      date: dateOnly,
    },
  });

  revalidatePath("/");
  revalidatePath("/meal-plan");
  return { formErrors: [], fieldErrors: {} };
}

export async function deleteMeal(mealId: string) {
  await prisma.meal.delete({
    where: { id: mealId },
  });

  revalidatePath("/");
  revalidatePath("/meal-plan");
}

const recipeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  ingredients: z.string(),
  instructions: z.string(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  sourceUrl: z.string().optional(),
});

export async function createRecipe(
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
  },
  formData: FormData,
) {
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

  await prisma.recipe.create({
    data: {
      name: name,
      description: description || null,
      ingredients: ingredients,
      instructions: instructions,
      prepTime: prepTime,
      cookTime: cookTime,
      sourceUrl: sourceUrl,
    },
  });

  revalidatePath("/recipes");

  return { formErrors: [], fieldErrors: {} };
}
