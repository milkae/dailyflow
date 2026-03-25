import { z } from "zod";

export const habitSchema = z.discriminatedUnion("frequency", [
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
