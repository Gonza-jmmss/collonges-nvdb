import { PrismaClient } from "@prisma/client";
import getActiveScholarYearQuery from "@/repositories/scholarYears/queries/getActiveScholarYearQuery";
import { StudentCourseAttendancesByDayAndStudentIdMap } from "../StudentCourseAttendancesViewModel";

const prisma = new PrismaClient();

type getStudentCourseAttendancesByDayAndStudentIdQueryParams = {
  StudentId: number;
  AttendanceDate: Date;
  PeriodNumber: number;
};

const getStudentCourseAttendancesByDayAndStudentIdQuery = async (
  params: getStudentCourseAttendancesByDayAndStudentIdQueryParams,
) => {
  const adjustedAttendanceDate = new Date(params.AttendanceDate);
  adjustedAttendanceDate.setHours(adjustedAttendanceDate.getHours() + 2);

  // Normalize AttendanceDate to get full day range
  const attendanceDateStart = new Date(adjustedAttendanceDate);
  attendanceDateStart.setUTCHours(0, 0, 0, 0);

  const attendanceDateEnd = new Date(attendanceDateStart);
  attendanceDateEnd.setUTCHours(23, 59, 59, 999);

  const activeScholarYear = await getActiveScholarYearQuery();

  const query = await prisma.studentCourseAttendances.findMany({
    where: {
      StudentCourses: {
        StudentId: params.StudentId,
        ScholarPeriods: {
          ScholarYearId: activeScholarYear.ScholarYearId,
          Number: params.PeriodNumber,
        },
      },
      AttendanceDate: {
        gte: attendanceDateStart,
        lte: attendanceDateEnd,
      },
    },
    orderBy: [
      { AttendancePeriod: "asc" },
      { StudentCourses: { Courses: { Name: "asc" } } },
    ],
    include: {
      Users: {
        select: {
          UserId: true,
          UserName: true,
        },
      },
      StudentCourses: {
        include: {
          Courses: {
            select: {
              CourseId: true,
              Name: true,
              CourseCode: true,
            },
          },
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
      },
    },
  });

  const result = query.map(
    (attendance: StudentCourseAttendancesByDayAndStudentIdMap) => ({
      CourseId: attendance.StudentCourses.CourseId,
      CourseName: attendance.StudentCourses.Courses.Name,
      CourseCode: attendance.StudentCourses.Courses.CourseCode,
      StudentCourseAttendanceId: attendance.StudentCourseAttendanceId,
      StudentCourseId: attendance.StudentCourseId,
      UserId: attendance.UserId,
      UserName: attendance.Users.UserName,
      AttendanceDate: attendance.AttendanceDate,
      AttendanceValue: attendance.AttendanceValue,
      AttendancePeriod: attendance.AttendancePeriod,
    }),
  );

  return result;
};

export default getStudentCourseAttendancesByDayAndStudentIdQuery;
