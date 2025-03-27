import { z } from "zod";

export const StudentCourseGrade = z.object({
  StudentCourseGradeId: z.number().nullable(),
  StudentCourseId: z.number().nullable(),
  Grade: z.string().nullable(),
});

export const StudentCourseGradeSchema = z.object({
  GradeCoefficientId: z.number().nullable(),
  UserId: z.number().nullable(),
  Description: z.string().nullable(),
  StudentCourses: z.array(StudentCourseGrade).nullable(),
});
