"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Frequency, MealType } from "@/generated/prisma/enums";

const habitSchema = z.object({
  name: z.string("Invalid name"),
  description: z.string("Invalid description").optional(),
  frequency: z.enum(Frequency).optional(),
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

  try {
    await prisma.habit.create({ data: { name, description, frequency } });
  } catch {
    return { formErrors: ["Failed to create habit"], fieldErrors: {} };
  }

  revalidatePath("/");
  return { formErrors: [], fieldErrors: {} };
}

export async function submitHabitEntryForm(id: string, formData: FormData) {
  const note = formData.get("note") as string;
  await createHabitEntry(id, undefined, note);
}

export async function createHabitEntry(
  id: string,
  date = new Date(),
  note?: string,
) {
  const entryDate = new Date(date);
  entryDate.setHours(0, 0, 0, 0);
  const dayEntry = await prisma.entry.findFirst({
    where: { habitId: id, date: entryDate },
  });

  if (dayEntry && dayEntry.note === note) {
    return;
  }

  if (dayEntry) {
    await prisma.entry.update({ where: { id: dayEntry.id }, data: { note } });
  } else {
    await prisma.entry.create({ data: { habitId: id, date: entryDate, note } });
  }

  revalidatePath("/");
}

export async function deleteHabitEntry(id: string, date = new Date()) {
  const entryDate = date;
  entryDate.setHours(0, 0, 0, 0);

  await prisma.entry.deleteMany({
    where: { habitId: id, date: entryDate },
  });
  revalidatePath("/");
}

export async function setDailyHabitStatus(id: string, completion: boolean) {
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
  name: z.string("Invalid name"),
  type: z.enum(MealType),
  date: z.coerce.date(),
});

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

  try {
    await prisma.meal.create({ data: { name, type, date } });
  } catch {
    return { formErrors: ["Failed to create meal"], fieldErrors: {} };
  }

  revalidatePath("/");
  return { formErrors: [], fieldErrors: {} };
}
