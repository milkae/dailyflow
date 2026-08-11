"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { Frequency } from "@/generated/prisma/enums";
import { parseHabit } from "@/utils/habits";
import { cache } from "react";
import { verifySession } from "@/lib/dal";
import { normalizeDate } from "@/utils/date";
import { createHabitSchema } from "@/lib/validators";
import { ActionState, Status } from "@/utils/action-state";
import { JsonNull } from "@prisma/client/runtime/client";
import {
  invalidateDashboard,
  invalidateDashboardAndPaths,
} from "@/lib/cache-invalidation";

const getFrequencyConfig = (frequency?: Frequency, config?: unknown) => {
  switch (frequency) {
    case Frequency.DAILY:
      return null;
    case Frequency.WEEKLY:
      return typeof config === "object" && config !== null
        ? { day: (config as { day: number }).day }
        : null;
    case Frequency.INTERVAL:
      return typeof config === "object" && config !== null
        ? { interval: (config as { interval: number }).interval }
        : null;
    case Frequency.SPECIFIC_DAYS:
      return typeof config === "object" && config !== null
        ? { days: (config as { days: number[] }).days }
        : null;
    case Frequency.MONTHLY:
      return typeof config === "object" && config !== null
        ? { day: (config as { day: number }).day }
        : null;
  }
};

export async function createOrUpdateHabit(
  _initialState: ActionState,
  formData: FormData,
) {
  const session = await verifySession();
  const formDataObj = Object.fromEntries(formData.entries());

  const parsedFrequencyConfig = getFrequencyConfig(
    formDataObj.frequency as Frequency,
    formDataObj.frequencyConfig
      ? JSON.parse(formDataObj.frequencyConfig as string)
      : null,
  );

  const validatedFields = createHabitSchema.safeParse({
    ...formDataObj,
    frequencyConfig: parsedFrequencyConfig,
  });

  if (!validatedFields.success) {
    return { ...z.flattenError(validatedFields.error), status: Status.ERROR };
  }

  const { name, description, frequency, frequencyConfig, id } =
    validatedFields.data;

  await prisma.habit.upsert({
    where: { id: id || "", userId: session.userId },
    update: {
      name,
      description,
      frequency,
      frequencyConfig: frequencyConfig === null ? JsonNull : frequencyConfig,
    },
    create: {
      name,
      description,
      frequency,
      frequencyConfig: frequencyConfig === null ? JsonNull : frequencyConfig,
      userId: session.userId,
    },
  });

  invalidateDashboardAndPaths(["/habits"]);

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

  invalidateDashboard();
  return { status: Status.SUCCESS };
}

export async function deleteHabitEntry(id: string, date = new Date()) {
  const session = await verifySession();
  const entryDate = normalizeDate(date);

  await prisma.entry.deleteMany({
    where: { habitId: id, date: entryDate, habit: { userId: session.userId } },
  });

  invalidateDashboard();
  return { status: Status.SUCCESS };
}

export async function toggleHabitCompletion(
  _initialState: ActionState,
  { id, completion }: { id: string; completion: boolean },
) {
  if (!completion) {
    return deleteHabitEntry(id);
  }

  return createHabitEntry(id);
}

export async function deleteHabit(id: string) {
  const session = await verifySession();

  await prisma.habit.delete({ where: { id, userId: session.userId } });
  invalidateDashboardAndPaths(["/habits"]);
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

export const getHabit = cache(async (id: string) => {
  const session = await verifySession();

  const habit = await prisma.habit.findUnique({
    where: { id, userId: session.userId },
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
  });

  return habit && parseHabit(habit);
});
