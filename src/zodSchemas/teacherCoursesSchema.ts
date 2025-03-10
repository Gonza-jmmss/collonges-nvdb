import { z } from "zod";

export const TeacherCourse = z.object({
  CourseId: z.number(),
});

export const TeacherCourseSchema = z.object({
  UserId: z.number(),
  TeacherCourses: z.array(TeacherCourse).nullable(),
});
