import { z } from "zod";

export const ScholarYearSchema = z.object({
  ScholarYearId: z.number().nullable(),
  Name: z.string(),
  FromDate: z.date().nullable(),
  ToDate: z.date().nullable(),
  IsActive: z.boolean(),
});
