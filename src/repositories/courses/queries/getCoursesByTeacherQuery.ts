"use server";

import { PrismaClient } from "@prisma/client";
import { CourseByTearcherMap } from "../coursesViewModel";

const prisma = new PrismaClient();

type getCoursesByTeacherQueryParamsType = {
  IsEnabled: boolean;
  Period: number;
  RoreName: string;
  UserId: number;
  LevelId: number | null;
};

const getCoursesByTeacherQuery = async (
  params: getCoursesByTeacherQueryParamsType,
) => {
  const query = await prisma.courses.findMany({
    where: {
      IsEnabled: params.IsEnabled,
      ...(params.Period !== 0 && { PeriodNumber: params.Period }),
      ...(params.LevelId !== null && {
        LevelCourses: {
          some: {
            LevelId: params.LevelId,
          },
        },
      }),
    },
    include: {
      CoursePeriods: true,
      TeacherCourses: {
        where: {
          ...((params.RoreName === "Professeur" ||
            params.RoreName === "Directeur") && { UserId: params.UserId }),
        },
      },
      LevelCourses: true,
    },
  });

  const sortedQuery = query.sort((a, b) => {
    const aHasTeacher = a.TeacherCourses.length > 0;
    const bHasTeacher = b.TeacherCourses.length > 0;

    if (aHasTeacher && !bHasTeacher) return -1;
    if (!aHasTeacher && bHasTeacher) return 1;
    return 0;
  });

  const res = sortedQuery.map((course: CourseByTearcherMap) => ({
    CourseId: course.CourseId,
    Name: course.Name,
    EnglishName: course.EnglishName,
    CourseCode: course.CourseCode,
    CreditAmount: course.CreditAmount,
    CoursePeriodId: course.CoursePeriodId,
    CoursePeriodName: course.CoursePeriods?.Name,
    PeriodNumber: course.PeriodNumber,
    CourseTypeId: course.CourseTypeId,
    IsEnabled: course.IsEnabled,
  }));

  return res;
};
export default getCoursesByTeacherQuery;
