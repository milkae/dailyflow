"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { MealType } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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

  const { name, notes } = validatedFields.data;

  await prisma.meal.upsert({
    where: { id: id || "", userId: session.user.id },
    update: { name, notes },
    create: {
      name,
      notes,
      type,
      date: dateOnly,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/meal-plan");
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
  revalidatePath("/meal/week-plan");
}
