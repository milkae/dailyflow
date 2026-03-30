"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Frequency } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { parseHabit } from "@/lib/habits";
import { headers } from "next/headers";

const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const habitSchema = z.object({
  id: z.string().optional(),
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

export async function createOrUpdateHabit(
  _initialState: {
    formErrors: string[];
    fieldErrors: { [i: string]: string[] };
    success: boolean;
  },
  formData: FormData,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = habitSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return { ...z.flattenError(validatedFields.error), success: false };
  }

  const { name, description, frequency, config, id } = validatedFields.data;
  const frequencyConfig =
    getFrequencyConfig(frequency, config ? JSON.parse(config) : null) ||
    undefined;

  await prisma.habit.upsert({
    where: { id: id || "", userId: session.user.id },
    update: { name, description, frequency, frequencyConfig },
    create: {
      name,
      description,
      frequency,
      frequencyConfig,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  return { formErrors: [], fieldErrors: {}, success: true };
}

export async function submitHabitEntryForm(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const note = (formData.get("note") as string) || "";
  await createHabitEntry(id, undefined, note);
}

export async function createHabitEntry(
  id: string,
  date = new Date(),
  note?: string,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const entryDate = normalizeDate(date);

  const existingEntry = await prisma.entry.findUnique({
    where: {
      habitId_date: { habitId: id, date: entryDate },
      habit: { userId: session.user.id },
    },
  });

  if (existingEntry && existingEntry.note === note) {
    return;
  }

  await prisma.entry.upsert({
    where: {
      habitId_date: { habitId: id, date: entryDate },
      habit: { userId: session.user.id },
    },
    update: { note },
    create: { habitId: id, date: entryDate, note },
  });

  revalidatePath("/");
}

export async function deleteHabitEntry(id: string, date = new Date()) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const entryDate = normalizeDate(date);

  await prisma.entry.deleteMany({
    where: { habitId: id, date: entryDate, habit: { userId: session.user.id } },
  });

  revalidatePath("/");
}

export async function toggleHabitCompletion(id: string, completion: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!completion) {
    return deleteHabitEntry(id);
  }

  return createHabitEntry(id);
}

export async function getLastMonthHabits() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      entries: {
        where: {
          date: { gte: previousMonth },
        },
      },
    },
  });

  return habits.map(parseHabit);
}

export async function deleteHabit(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  await prisma.habit.delete({ where: { id, userId: session.user.id } });
  revalidatePath("/");
}
