import { PrismaClient } from "@prisma/client";
import { CoursesMap } from "../teacherCoursesViewModel";

const prisma = new PrismaClient();

type getTeacherCoursesByIdQueryParamsType = {
  UserId: number;
};

const getTeacherCoursesByIdQuery = async (
  params: getTeacherCoursesByIdQueryParamsType,
) => {
  const query = await prisma.users.findFirstOrThrow({
    where: { UserId: params.UserId },
    include: {
      TeacherCourses: {
        include: { Courses: true },
      },
    },
  });

  const res = {
    UserId: query.UserId,
    UserName: query.UserName,
    IsEnabled: query.IsEnabled,
    TeacherCourses: query.TeacherCourses.map((course: CoursesMap) => ({
      CourseId: course.CourseId,
      Name: course.Courses.Name,
      EnglishName: course.Courses.EnglishName,
      CourseCode: course.Courses.CourseCode,
      CreditAmount: course.Courses.CreditAmount,
    })),
  };

  return res;
};

export default getTeacherCoursesByIdQuery;
