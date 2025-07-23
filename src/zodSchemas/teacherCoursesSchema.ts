import { z } from "zod";

export const TeacherCourse = z.object({
  CourseId: z.number(),
});

export const TeacherCourseSchema = z.object({
  UserId: z.number(),
  PeriodNumber: z.number().int().min(1).max(4),
  TeacherCourses: z.array(TeacherCourse).nullable(),
});
