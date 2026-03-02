"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { calculateStreaks } from "./utils";

const schema = z.object({
  name: z.string("Invalid name"),
  description: z.string("Invalid description").optional(),
});

export async function createHabit(
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
  },
  formData: FormData,
) {
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = schema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return z.flattenError(validatedFields.error);
  }

  const { name, description } = validatedFields.data;

  try {
    await prisma.habit.create({ data: { name, description } });
  } catch {
    return { formErrors: ["Failed to create habit"], fieldErrors: {} };
  }

  revalidatePath("/");
  return { formErrors: [], fieldErrors: {} };
}

export async function setHabitCompleted(
  id: string,
  completed: boolean,
  date = new Date(),
) {
  const today = date;
  today.setHours(0, 0, 0, 0);

  if (completed) {
    await prisma.entry.create({ data: { habitId: id, date: today } });
  } else {
    await prisma.entry.deleteMany({
      where: { habitId: id, date: today },
    });
  }
  revalidatePath("/");
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

  return habits.map(calculateStreaks);
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
  revalidatePath("/");
}
