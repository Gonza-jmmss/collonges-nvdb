import { PrismaClient } from "@prisma/client";
import getActiveScholarYearQuery from "@/repositories/scholarYears/queries/getActiveScholarYearQuery";
import {
  StudentCourseAttendancesByCourseAndStudentIdViewModel,
  StudentCourseAttendancesByCourseAndStudentId,
  StudentCourseAttendancesByDayAndStudentIdMap,
} from "../StudentCourseAttendancesViewModel";

const prisma = new PrismaClient();

type getStudentCourseAttendancesByCourseAndStudentIdQueryParams = {
  StudentId: number;
  PeriodNumber: number;
};

const getStudentCourseAttendancesByCourseAndStudentIdQuery = async (
  params: getStudentCourseAttendancesByCourseAndStudentIdQueryParams,
) => {
  const activeScholarYear = await getActiveScholarYearQuery();

  getStudentCourseAttendancesByCourseAndStudentIdQuery;
  const query = await prisma.studentCourseAttendances.findMany({
    where: {
      StudentCourses: {
        StudentId: params.StudentId,
        ScholarPeriods: {
          ScholarYearId: activeScholarYear.ScholarYearId,
          Number: params.PeriodNumber,
        },
      },
    },
    orderBy: [
      { StudentCourses: { Courses: { Name: "asc" } } },
      { AttendancePeriod: "asc" },
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

  // Create an intermediate mapping to help with grouping
  const groupMap: Record<
    string,
    StudentCourseAttendancesByCourseAndStudentIdViewModel
  > = {};

  // Process each record
  query.forEach((attendance: StudentCourseAttendancesByDayAndStudentIdMap) => {
    // const student = attendance.StudentCourses.StudentId;
    const course = attendance.StudentCourses.Courses.CourseId;

    // If this course is not in our map yet, create the base object
    if (!groupMap[course]) {
      groupMap[course] = {
        CourseId: attendance.StudentCourses.Courses.CourseId,
        CourseName: attendance.StudentCourses.Courses.Name,
        CourseCode: attendance.StudentCourses.Courses.CourseCode,
        AttendanceScore: attendance.StudentCourses.AttendanceScore,
        Attendances: [],
      };
    }

    const attendanceEntry: StudentCourseAttendancesByCourseAndStudentId = {
      StudentCourseAttendanceId: attendance.StudentCourseAttendanceId,
      StudentCourseId: attendance.StudentCourseId,
      UserId: attendance.UserId,
      UserName: attendance.Users.UserName,
      AttendanceDate: attendance.AttendanceDate,
      AttendanceValue: attendance.AttendanceValue,
      AttendancePeriod: attendance.AttendancePeriod,
    };

    groupMap[course].Attendances.push(attendanceEntry);
  });

  // Convert map to array
  const result = Object.values(groupMap);

  return result;
};

export default getStudentCourseAttendancesByCourseAndStudentIdQuery;
