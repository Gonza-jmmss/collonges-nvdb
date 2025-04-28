import { z } from "zod";

export const ScholarPeriodSchema = z.object({
  ScholarPeriodId: z.number().nullable(),
  Name: z.string(),
  Number: z.number(),
  FromDate: z.date().nullable(),
  ToDate: z.date().nullable(),
  IsActive: z.boolean(),
  ScholarYearId: z.number(),
});
