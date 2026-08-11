import { MealType } from "@/generated/prisma/enums";
import { z } from "zod";

export const habitFrequencySchema = z.discriminatedUnion("frequency", [
  z.object({
    frequency: z.literal("DAILY"),
    frequencyConfig: z.null(),
  }),
  z.object({
    frequency: z.literal("WEEKLY"),
    frequencyConfig: z.object({ day: z.number().min(0).max(6) }),
  }),
  z.object({
    frequency: z.literal("MONTHLY"),
    frequencyConfig: z.object({ day: z.number().min(1).max(31) }),
  }),
  z.object({
    frequency: z.literal("SPECIFIC_DAYS"),
    frequencyConfig: z.object({ days: z.array(z.number().min(0).max(6)) }),
  }),
  z.object({
    frequency: z.literal("INTERVAL"),
    frequencyConfig: z.object({ interval: z.number().min(1) }),
  }),
]);

export const createHabitSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional(),
    frequency: z.enum([
      "DAILY",
      "WEEKLY",
      "MONTHLY",
      "SPECIFIC_DAYS",
      "INTERVAL",
    ]),
  })
  .and(habitFrequencySchema);

export const createRecipeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  ingredients: z.string().min(1, "Ingredients required"),
  instructions: z.string().min(1, "Instructions required"),
  prepTime: z.coerce.number().int().min(0).optional(),
  cookTime: z.coerce.number().int().min(0).optional(),
  servings: z.coerce.number().int().min(1).default(4),
  sourceUrl: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const createMealSchema = z.object({
  name: z.string().min(1).max(100),
  recipeId: z.string().optional(),
  notes: z.string().max(500).optional(),
  type: z.enum(MealType),
  date: z.coerce.date(),
});
