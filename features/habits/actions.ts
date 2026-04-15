"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath, updateTag } from "next/cache";
import { Frequency } from "@/generated/prisma/enums";
import { parseHabit } from "@/utils/habits";
import { cache } from "react";
import { verifySession } from "@/lib/dal";
import { normalizeDate } from "@/utils/date";
import { createHabitSchema } from "@/lib/validators";
import { ActionState, Status } from "@/utils/action-state";

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

export async function createOrUpdateHabit(
  _initialState: ActionState,
  formData: FormData,
) {
  const session = await verifySession();
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = createHabitSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return { ...z.flattenError(validatedFields.error), status: Status.ERROR };
  }

  const { name, description, frequency, frequencyConfig, id } =
    validatedFields.data;
  const parsedFrequencyConfig =
    getFrequencyConfig(
      frequency,
      frequencyConfig ? JSON.parse(frequencyConfig) : null,
    ) || undefined;

  await prisma.habit.upsert({
    where: { id: id || "", userId: session.userId },
    update: {
      name,
      description,
      frequency,
      frequencyConfig: parsedFrequencyConfig,
    },
    create: {
      name,
      description,
      frequency,
      frequencyConfig: parsedFrequencyConfig,
      userId: session.userId,
    },
  });

  updateTag("dashboard");
  revalidatePath("/");
  revalidatePath("/habits");

  return { formErrors: [], fieldErrors: {}, status: Status.SUCCESS };
}

export async function submitHabitEntryForm(
  id: string,
  _initialState: ActionState,
  formData: FormData,
) {
  const note = (formData.get("note") as string) || "";
  return createHabitEntry(id, undefined, note);
}

export async function createHabitEntry(
  id: string,
  date = new Date(),
  note?: string,
) {
  const session = await verifySession();
  const entryDate = normalizeDate(date);

  const existingEntry = await prisma.entry.findUnique({
    where: {
      habitId_date: { habitId: id, date: entryDate },
      habit: { userId: session.userId },
    },
  });

  if (existingEntry && existingEntry.note === note) {
    return { status: Status.SUCCESS };
  }

  await prisma.entry.upsert({
    where: {
      habitId_date: { habitId: id, date: entryDate },
      habit: { userId: session.userId },
    },
    update: { note },
    create: { habitId: id, date: entryDate, note },
  });

  updateTag("dashboard");
  revalidatePath("/");
  return { status: Status.SUCCESS };
}

export async function deleteHabitEntry(id: string, date = new Date()) {
  const session = await verifySession();
  const entryDate = normalizeDate(date);

  await prisma.entry.deleteMany({
    where: { habitId: id, date: entryDate, habit: { userId: session.userId } },
  });

  updateTag("dashboard");
  revalidatePath("/");
}

export async function toggleHabitCompletion(id: string, completion: boolean) {
  if (!completion) {
    return deleteHabitEntry(id);
  }

  return createHabitEntry(id);
}

export async function deleteHabit(id: string) {
  const session = await verifySession();

  await prisma.habit.delete({ where: { id, userId: session.userId } });
  updateTag("dashboard");
  revalidatePath("/");
  revalidatePath("/habits");
}

export const getHabits = cache(async () => {
  const session = await verifySession();
  return getHabitsForUser({ userId: session.userId });
});

export const getHabitsForUser = cache(
  async ({ userId }: { userId: string }) => {
    "use cache";

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        entries: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    });

    return habits.map(parseHabit);
  },
);
