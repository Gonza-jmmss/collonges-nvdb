import { PrismaClient } from "@prisma/client";
import {
  StudentCoursesGroupedByStudentMap,
  AllStudentCoursesMap,
} from "../studentCoursesViewModel";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { PeriodEnum } from "@/enum/periodEnum";

const prisma = new PrismaClient();

type getAllStudentCoursesQueryParams = {
  ScholarYearId: number;
  ScholarPeriodId: number;
  PeriodNumber: number | null | undefined;
  scholarLevelId?: number | null;
};

const getAllStudentCoursesQuery = async (
  params: getAllStudentCoursesQueryParams,
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
      ...(params.scholarLevelId && {
        StudentCourses: {
          some: {
            ScholarPeriods: {
              ScholarYearId: params.ScholarYearId,
              ...(params.ScholarPeriodId !== 0 && {
                ScholarPeriodId: params.ScholarPeriodId,
              }),
            },
            Courses: {
              LevelCourses: {
                some: {
                  LevelId: params.scholarLevelId,
                },
              },
            },
          },
        },
      }),
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
            include: {
              LevelCourses: {
                ...(params.scholarLevelId && {
                  where: {
                    LevelId: params.scholarLevelId,
                  },
                }),

                include: {
                  Levels: true,
                },
              },
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
      (studentCourse: AllStudentCoursesMap) => ({
        StudentCourseId: studentCourse.StudentCourseId,
        Note: studentCourse.Note,
        ScholarPeriodId: studentCourse.ScholarPeriodId,
        ScholarPeriodName: studentCourse.ScholarPeriods.Name,
        CourseId: studentCourse.Courses.CourseId,
        Name: studentCourse.Courses.Name,
        CourseCode: studentCourse.Courses.CourseCode,
        LevelName:
          studentCourse.Courses.LevelCourses.length > 0
            ? studentCourse.Courses.LevelCourses[0].Levels.Name
            : null,
      }),
    ),
  }));

  return res;
};

export default getAllStudentCoursesQuery;
