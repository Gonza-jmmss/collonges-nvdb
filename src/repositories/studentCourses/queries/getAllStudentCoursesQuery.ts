import { PrismaClient } from "@prisma/client";
import {
  StudentCoursesGroupedByStudentMap,
  StudentCourseGroupedByStudentMap,
} from "../studentCoursesViewModel";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { PeriodEnum } from "@/enum/periodEnum";

const prisma = new PrismaClient();

type getAllStudentCoursesQueryParamsType = {
  ScholarYearId: number;
  ScholarPeriodId: number;
  PeriodNumber: number | null | undefined;
};

const getAllStudentCoursesQuery = async (
  params: getAllStudentCoursesQueryParamsType,
) => {
  const query = await prisma.students.findMany({
    orderBy: [{ Persons: { AlternativeName: "asc" } }],
    where: {
      IsEnabled: true,
      YearPeriods: {
        ScholarYearId: params.ScholarYearId,
        PeriodType:
          params.PeriodNumber === PeriodEnum["Cours d'été"]
            ? YearPeriodsEnum["Cours d'été"]
            : YearPeriodsEnum["Année scolaire"],
      },
    },
    include: {
      Persons: {
        select: {
          AlternativeName: true,
        },
      },
      StudentCourses: {
        where: {
          ScholarPeriods: {
            ScholarYearId: params.ScholarYearId,
            ...(params.ScholarPeriodId !== 0 && {
              ScholarPeriodId: params.ScholarPeriodId,
            }),
          },
        },
        include: {
          Courses: {
            select: {
              CourseId: true,
              Name: true,
              EnglishName: true,
              CourseCode: true,
            },
          },
          ScholarPeriods: {
            select: {
              ScholarPeriodId: true,
              Name: true,
              Number: true,
            },
          },
        },
      },
    },
  });

  const res = query.map((student: StudentCoursesGroupedByStudentMap) => ({
    StudentId: student.StudentId,
    AlternativeName: student.Persons.AlternativeName,
    IsEnabled: student.IsEnabled,
    StudentCourses: student.StudentCourses.map(
      (studentCourse: StudentCourseGroupedByStudentMap) => ({
        StudentCourseId: studentCourse.StudentCourseId,
        Note: studentCourse.Note,
        ScholarPeriodId: studentCourse.ScholarPeriodId,
        ScholarPeriodName: studentCourse.ScholarPeriods.Name,
        CourseId: studentCourse.Courses.CourseId,
        Name: studentCourse.Courses.Name,
        CourseCode: studentCourse.Courses.CourseCode,
      }),
    ),
  }));

  return res;
};

export default getAllStudentCoursesQuery;
