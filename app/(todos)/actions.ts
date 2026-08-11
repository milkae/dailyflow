"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { verifySession } from "@/lib/dal";
import { createTodoSchema } from "./validators";
import { ActionState, Status } from "@/utils/action-state";
import z from "zod";
import { revalidatePath } from "next/cache";

export const getAllTodos = cache(async () => {
  const session = await verifySession();
  const todos = await prisma.todo.findMany({
    where: { userId: session.userId },
  });

  return todos;
});

export const createTodo = async (
  _initialState: ActionState,
  formData: FormData,
) => {
  const session = await verifySession();
  const formDataObj = Object.fromEntries(formData.entries());
  const validatedFields = createTodoSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    return { ...z.flattenError(validatedFields.error), status: Status.ERROR };
  }

  const todo = validatedFields.data;
  await prisma.todo.create({
    data: { ...todo, userId: session.userId },
  });

  revalidatePath("/todos");
  return { formErrors: [], fieldErrors: {}, status: Status.SUCCESS };
};

export const toggleTodoStatus = async (
  _initialState: ActionState,
  { id, completion }: { id: string; completion: boolean },
) => {
  const session = await verifySession();
  await prisma.todo.update({
    where: { id, userId: session.userId },
    data: { isDone: completion },
  });
  revalidatePath("/todos");
  return { status: Status.SUCCESS };
};
