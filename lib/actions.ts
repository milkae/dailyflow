"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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
