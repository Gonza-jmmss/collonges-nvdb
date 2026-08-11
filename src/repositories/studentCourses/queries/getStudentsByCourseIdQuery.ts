import { PrismaClient } from "@prisma/client";
import { StudentsByCourseIdMap } from "../studentCoursesViewModel";
import getActiveScholarYearQuery from "@/repositories/scholarYears/queries/getActiveScholarYearQuery";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { PeriodEnum } from "@/enum/periodEnum";

const prisma = new PrismaClient();

type getStudentsByCourseIdQueryParamsType = {
  CourseId: number;
  PeriodNumber: number;
  Action: string;
  Description?: string;
  AttendanceDate?: Date;
};

const getStudentsByCourseIdQuery = async (
  params: getStudentsByCourseIdQueryParamsType,
) => {
  const activeScholarYear = await getActiveScholarYearQuery();

  let attendaceDateStart;
  let attendaceDateEnd;
  if (params.AttendanceDate) {
    // Normalize `AttendanceDate` by truncating milliseconds
    attendaceDateStart = new Date(params.AttendanceDate);
    attendaceDateStart.setMilliseconds(0); // Set milliseconds to 0

    attendaceDateEnd = new Date(attendaceDateStart);
    attendaceDateEnd.setSeconds(attendaceDateEnd.getSeconds() + 1); // Next second to create a range
  }
  const query = await prisma.studentCourses.findMany({
    orderBy: [{ Students: { Persons: { AlternativeName: "asc" } } }],
    where: {
      CourseId: params.CourseId,
      Students: {
        ...(params.Action === "create" && { IsEnabled: true }),
        YearPeriods: {
          ScholarYearId: activeScholarYear.ScholarYearId,
          PeriodType:
            params.PeriodNumber === PeriodEnum["Cours d'été"]
              ? YearPeriodsEnum["Cours d'été"]
              : YearPeriodsEnum["Année scolaire"],
        },
      },
      ...(params.Action !== "create" && {
        OR: [
          { Students: { IsEnabled: true } }, // All enabled students
          // Disabled students with grades for this description
          ...(params.Description
            ? [
                {
                  Students: { IsEnabled: false },
                  StudentCourseGrades: {
                    some: {
                      Description: params.Description,
                    },
                  },
                },
              ]
            : []),
          // Disabled students with attendance for this date
          ...(params.AttendanceDate
            ? [
                {
                  Students: { IsEnabled: false },
                  StudentCourseAttendances: {
                    some: {
                      AttendanceDate: {
                        gte: attendaceDateStart,
                        lt: attendaceDateEnd,
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      }),
    },
    include: {
      Students: {
        include: {
          Persons: {
            select: {
              AlternativeName: true,
            },
          },
        },
      },
    },
  });

  const res = query.map((studentCourse: StudentsByCourseIdMap) => ({
    StudentCourseId: studentCourse.StudentCourseId,
    StudentId: studentCourse.StudentId,
    CourseId: studentCourse.CourseId,
    Note: studentCourse.Note,
    ScholarPeriodId: studentCourse.ScholarPeriodId,
    StudentName: studentCourse.Students.Persons.AlternativeName,
    AttendanceScore: studentCourse.AttendanceScore,
  }));

  return res;
};

export default getStudentsByCourseIdQuery;
