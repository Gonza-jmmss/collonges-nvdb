import { z } from "zod";

export const GradeCoefficientSchema = z.object({
  GradeCoefficientId: z.number().nullable(),
  Name: z.string(),
  Coefficient: z.number(),
  IsEnabled: z.boolean(),
});
