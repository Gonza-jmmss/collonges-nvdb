import { z } from "zod";

export const YearPeriodSchema = z.object({
  YearPeriodId: z.number().nullable(),
  Name: z.string(),
  PeriodType: z.number().nullable(),
  ScholarYearId: z.number().nullable(),
  IsEnabled: z.boolean(),
});
