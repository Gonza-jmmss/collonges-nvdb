import { z } from "zod";

export const CollegeSchema = z.object({
  CollegeId: z.number(),
  Name: z.string().nullable(),
  Abbreviation: z.string().nullable(),
});
