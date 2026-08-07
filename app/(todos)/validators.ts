import { z } from "zod";

export const createTodoSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  urgent: z.coerce.boolean().optional(),
});
