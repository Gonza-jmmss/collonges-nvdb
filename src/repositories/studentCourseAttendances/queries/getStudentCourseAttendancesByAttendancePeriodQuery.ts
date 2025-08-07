import { PrismaClient } from "@prisma/client";
import { StudentCourseAttendancesByAttendancePeriodMap } from "../StudentCourseAttendancesViewModel";

const prisma = new PrismaClient();

type getStudentCourseAttendancesByAttendancePeriodQueryParams = {
  CourseId: number;
  AttendanceDate: Date;
  AttendancePeriod: number;
};

const getStudentCourseAttendancesByAttendancePeriodQuery = async (
  params: getStudentCourseAttendancesByAttendancePeriodQueryParams,
) => {
  // Normalize `AttendanceDate` by truncating milliseconds
  const attendaceDateStart = new Date(params.AttendanceDate);
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
  });

  const res = query.map(
    (attendances: StudentCourseAttendancesByAttendancePeriodMap) => ({
      StudentCourseAttendanceId: attendances.StudentCourseAttendanceId,
      StudentCourseId: attendances.StudentCourseId,
      UserId: attendances.UserId,
      AttendanceDate: attendances.AttendanceDate,
      AttendanceValue: attendances.AttendanceValue,
      AttendancePeriod: attendances.AttendancePeriod,
    }),
  );

  return res;
};

export default getStudentCourseAttendancesByAttendancePeriodQuery;
