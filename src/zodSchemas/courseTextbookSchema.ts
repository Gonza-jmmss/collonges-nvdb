import { z } from "zod";

export const CourseHomework = z.object({
  CourseHomeworkId: z.number().nullable(),
  CourseId: z.number(),
  UserId: z.number(),
  HomeworkDate: z.date(),
  HomeworkDueDate: z.date(),
  Description: z.string(),
  ReferenceDate: z.date(),
  // Documents: z.array(z.string()).nullable(),
  Documents: z
    .array(z.string())
    .nullable()
    .default([])
    .transform((val) => val ?? []),
});

export const CourseContentSchema = z.object({
  CourseContentId: z.number().nullable(),
  CourseId: z.number(),
  UserId: z.number(),
  ContentDate: z.date(),
  Content: z.string(),
  ReferenceDate: z.date(),
  Homeworks: z.array(CourseHomework).nullable(),
  Documents: z.array(z.string()).nullable(),
});
