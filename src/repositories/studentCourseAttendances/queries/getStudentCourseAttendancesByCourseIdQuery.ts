import { PrismaClient } from "@prisma/client";
import { StudentCourseAttendancesByCourseIdMap } from "../StudentCourseAttendancesViewModel";

const prisma = new PrismaClient();

type getStudentCourseAttendancesByCourseIdQueryParams = {
  CourseId: number;
  AttendanceDate: Date;
  AttendancePeriod: number;
};

const getStudentCourseAttendancesByCourseIdQuery = async (
  params: getStudentCourseAttendancesByCourseIdQueryParams,
) => {
  const adjustedAttendanceDate = new Date(params.AttendanceDate);
  adjustedAttendanceDate.setHours(adjustedAttendanceDate.getHours() + 2);

  // Normalize `AttendaceDate` by truncating milliseconds
  const attendaceDateStart = new Date(adjustedAttendanceDate);
  attendaceDateStart.setMilliseconds(0); // Set milliseconds to 0

  const attendaceDateEnd = new Date(attendaceDateStart);
  attendaceDateEnd.setSeconds(attendaceDateEnd.getSeconds() + 1); // Next second to create a range

  const query = await prisma.studentCourseAttendances.findMany({
    where: {
      StudentCourses: { CourseId: params.CourseId },
      AttendancePeriod: params.AttendancePeriod,
      AttendanceDate: {
        gte: attendaceDateStart, // Start of the second
        lt: attendaceDateEnd, // Less than the next second
      },
    },
    include: {
      StudentCourses: {
        select: {
          StudentCourseId: true,
        },
      },
    },
  });

  if (query.length > 0) {
    const res = {
      UserId: query[0].UserId,
      AttendanceDate: query[0].AttendanceDate,
      AttendancePeriod: query[0].AttendancePeriod,
      StudentCourseAttendances: query.map(
        (studentCourseAttendance: StudentCourseAttendancesByCourseIdMap) => ({
          StudentCourseAttendanceId:
            studentCourseAttendance.StudentCourseAttendanceId,
          StudentCourseId:
            studentCourseAttendance.StudentCourses.StudentCourseId,
          AttendanceValue: studentCourseAttendance.AttendanceValue,
        }),
      ),
    };

    return res;
  } else {
    return null;
  }
};

export default getStudentCourseAttendancesByCourseIdQuery;
