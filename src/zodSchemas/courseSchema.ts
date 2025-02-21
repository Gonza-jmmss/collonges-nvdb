import { z } from "zod";

export const CourseSchema = z.object({
  CourseId: z.number().nullable(),
  Name: z.string(),
  EnglishName: z.string(),
  CourseCode: z.string().nullable(),
  CreditAmount: z.number().nullable(),
  CoursePeriodId: z.number(),
  PeriodNumber: z.number().nullable(),
  CourseTypeId: z.number(),
  IsEnabled: z.boolean(),
});
