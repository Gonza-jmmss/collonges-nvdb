import { z } from "zod";

export const LevelCourse = z.object({
  CourseId: z.number(),
});

export const LevelSchema = z.object({
  LevelId: z.number(),
  Name: z.string(),
  IsEnabled: z.boolean(),
  PeriodNumber: z.number().int().min(1).max(4),
  LevelCourses: z.array(LevelCourse).nullable(),
});
