import { PrismaClient } from "@prisma/client";
import {
  StudentCoursesGroupedByStudentMap,
  StudentCourseGroupedByStudentMap,
} from "../studentCoursesViewModel";

const prisma = new PrismaClient();

type getAllStudentCoursesQueryParamsType = {
  ScholarYearId: number;
  ScholarPeriodId: number;
};

const getAllStudentCoursesQuery = async (
  params: getAllStudentCoursesQueryParamsType,
) => {
  const query = await prisma.students.findMany({
    orderBy: [{ IsEnabled: "desc" }, { Persons: { AlternativeName: "asc" } }],
    where: {
      StudentCourses: {
        some: {
          ScholarPeriods: {
            ScholarYearId: params.ScholarYearId,
          },
        },
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
