import { PrismaClient } from "@prisma/client";
import getActiveScholarYearQuery from "@/repositories/scholarYears/queries/getActiveScholarYearQuery";
import {
  StudentCourseAttendancesByStudentViewModel,
  StudentCourseAttendancesByStudent,
  StudentCourseAttendancesByStudentMap,
} from "../StudentCourseAttendancesViewModel";

const prisma = new PrismaClient();

type getStudentCourseAttendancesByStudentQueryParams = {
  PeriodNumber: number;
};

const getStudentCourseAttendancesByStudentQuery = async (
  params: getStudentCourseAttendancesByStudentQueryParams,
) => {
  const activeScholarYear = await getActiveScholarYearQuery();

  const query = await prisma.studentCourseAttendances.findMany({
    where: {
      StudentCourses: {
        ScholarPeriods: {
          ScholarYearId: activeScholarYear.ScholarYearId,
          Number: params.PeriodNumber,
        },
      },
    },
    orderBy: [
      { StudentCourses: { Students: { Persons: { AlternativeName: "asc" } } } },
    ],
    include: {
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
  const groupMap: Record<string, StudentCourseAttendancesByStudentViewModel> =
    {};

  // Process each record
  query.forEach((attendance: StudentCourseAttendancesByStudentMap) => {
    const student = attendance.StudentCourses.StudentId;
    const courseId = attendance.StudentCourses.Courses.CourseId;

    // If this student is not in our map yet, create the base object
    if (!groupMap[student]) {
      groupMap[student] = {
        StudentId: attendance.StudentCourses.StudentId,
        StudentName: attendance.StudentCourses.Students.Persons.AlternativeName,
        Attendances: [],
      };
    }

    // Check if this course already exists for this student
    const existingCourse = groupMap[student].Attendances.find(
      (att) => att.CourseId === courseId,
    );

    if (!existingCourse) {
      // Only add if course doesn't exist yet
      const attendanceEntry: StudentCourseAttendancesByStudent = {
        CourseId: attendance.StudentCourses.Courses.CourseId,
        CourseName: attendance.StudentCourses.Courses.Name,
        CourseCode: attendance.StudentCourses.Courses.CourseCode,
        AttendanceScore: attendance.StudentCourses.AttendanceScore,
      };

      groupMap[student].Attendances.push(attendanceEntry);
    }
  });

  // Convert map to array
  const result = Object.values(groupMap);

  return result;
};

export default getStudentCourseAttendancesByStudentQuery;
