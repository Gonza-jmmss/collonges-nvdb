"use server";

import { PrismaClient } from "@prisma/client";
import getStudentCourseAttendancesByAttendancePeriodQuery from "../queries/getStudentCourseAttendancesByAttendancePeriodQuery";
import updateAttendanceOfStudentCourseCommand from "@/repositories/studentCourses/commands/updateAttendanceOfStudentCourseCommand";
import { StudentCourseAttendancesByAttendancePeriodViewModel } from "../StudentCourseAttendancesViewModel";

const prisma = new PrismaClient();

type deleteStudentCourseAttendanceCommandParams = {
  CourseId: number;
  AttendanceDate: Date;
  AttendancePeriod: number;
};

const deleteStudentCourseAttendanceCommand = async (
  params: deleteStudentCourseAttendanceCommandParams,
) => {
  // Normalize `AttendanceDate` by truncating milliseconds
  const attendaceDateStart = new Date(params.AttendanceDate);
  attendaceDateStart.setMilliseconds(0); // Set milliseconds to 0

  const attendaceDateEnd = new Date(attendaceDateStart);
  attendaceDateEnd.setSeconds(attendaceDateEnd.getSeconds() + 1); // Next second to create a range

  const studentCourseAttendancesByAttendancePeriod =
    await getStudentCourseAttendancesByAttendancePeriodQuery({
      CourseId: params.CourseId,
      AttendanceDate: params.AttendanceDate,
      AttendancePeriod: params.AttendancePeriod,
    });

  if (studentCourseAttendancesByAttendancePeriod.length === 0) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    await tx.studentCourseAttendances.deleteMany({
      where: {
        StudentCourseAttendanceId: {
          in: studentCourseAttendancesByAttendancePeriod.map(
            (attendance: StudentCourseAttendancesByAttendancePeriodViewModel) =>
              attendance.StudentCourseAttendanceId,
          ),
        },
      },
    });

    // Wait for all update operations to complete
    await Promise.all(
      studentCourseAttendancesByAttendancePeriod.map(
        async (
          attendance: StudentCourseAttendancesByAttendancePeriodViewModel,
        ) => {
          return updateAttendanceOfStudentCourseCommand({
            StudentCourseId: attendance.StudentCourseId,
            transactionClient: tx,
          });
        },
      ),
    );

    return { success: true };
  });
};

export default deleteStudentCourseAttendanceCommand;
