import { z } from "zod";

export const StudentCourse = z.object({
  CourseId: z.number(),
});

export const StudentCourseSchema = z.object({
  StudentId: z.number(),
  ScholarPeriodId: z.number(),
  StudentCourses: z.array(StudentCourse).nullable(),
});
