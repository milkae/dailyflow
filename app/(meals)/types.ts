import { Prisma } from "@/generated/prisma/client";

export type MealWithRecipeName = Prisma.MealGetPayload<{
  include: { recipe: { select: { id: true; name: true } } };
}>;
