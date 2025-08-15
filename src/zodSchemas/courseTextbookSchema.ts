import { z } from "zod";

export const CourseHomework = z.object({
  CourseHomeworkId: z.number().nullable(),
  CourseId: z.number(),
  UserId: z.number(),
  HomeworkDate: z.date(),
  HomeworkDueDate: z.date(),
  Description: z.string(),
  ReferenceDate: z.date(),
});

export const CourseContentSchema = z.object({
  CourseContentId: z.number().nullable(),
  CourseId: z.number(),
  UserId: z.number(),
  ContentDate: z.date(),
  Content: z.string(),
  ReferenceDate: z.date(),
  Homeworks: z.array(CourseHomework).nullable(),
});
