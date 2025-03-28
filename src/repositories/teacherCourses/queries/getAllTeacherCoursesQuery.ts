import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { TeacherCoursesMap, CoursesMap } from "../teacherCoursesViewModel";

const prisma = new PrismaClient();

const getAllTeacherCoursesQuery = cache(async () => {
  const query = await prisma.users.findMany({
    where: {
      Roles: { Name: { in: ["Professeur", "Directeur"] }, IsEnabled: true },
      IsEnabled: true,
    },
    include: {
      TeacherCourses: {
        include: { Courses: true },
      },
    },
  });

  const res = query.map((teacher: TeacherCoursesMap) => ({
    UserId: teacher.UserId,
    UserName: teacher.UserName,
    IsEnabled: teacher.IsEnabled,
    TeacherCourses: teacher.TeacherCourses.map((course: CoursesMap) => ({
      CourseId: course.CourseId,
      Name: course.Courses.Name,
      EnglishName: course.Courses.EnglishName,
      CourseCode: course.Courses.CourseCode,
      CreditAmount: course.Courses.CreditAmount,
    })),
  }));

  return res;
});

export default getAllTeacherCoursesQuery;
