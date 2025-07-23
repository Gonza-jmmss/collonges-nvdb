import { PrismaClient } from "@prisma/client";
import { TeacherCoursesMap, CoursesMap } from "../teacherCoursesViewModel";

const prisma = new PrismaClient();

type getAllTeacherCoursesQueryParamas = {
  PeriodNumber: number;
};

const getAllTeacherCoursesQuery = async (
  params: getAllTeacherCoursesQueryParamas,
) => {
  const query = await prisma.users.findMany({
    where: {
      Roles: { Name: { in: ["Professeur", "Directeur"] }, IsEnabled: true },
      IsEnabled: true,
      // TeacherCourses: { some: { PeriodNumber: params.PeriodNumber } },
    },
    include: {
      TeacherCourses: {
        where: { PeriodNumber: params.PeriodNumber },
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
      PeriodNumber: course.PeriodNumber,
    })),
  }));

  return res;
};

export default getAllTeacherCoursesQuery;
