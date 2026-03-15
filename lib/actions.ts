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
});

const mealSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  type: z.enum(MealType),
  date: z.coerce.date(),
});

export async function createHabit(
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
  },
  formData: FormData,
) {
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = habitSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return z.flattenError(validatedFields.error);
  }

  const { name, description, frequency } = validatedFields.data;

  await prisma.habit.create({ data: { name, description, frequency } });

  revalidatePath("/");
  return { formErrors: [], fieldErrors: {} };
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

export async function createMeal(
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
  },
  formData: FormData,
) {
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = mealSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return z.flattenError(validatedFields.error);
  }

  const { name, type, date } = validatedFields.data;

  await prisma.meal.create({ data: { name, type, date } });

  revalidatePath("/");
  return { formErrors: [], fieldErrors: {} };
}
