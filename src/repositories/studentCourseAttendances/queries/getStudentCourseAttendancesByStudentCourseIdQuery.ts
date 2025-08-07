import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type getStudentCourseAttendancesByStudentCourseIdQueryParams = {
  StudentCourseId: number;
  transactionClient?: any;
};

type AttendanceResult = {
  StudentCourseAttendanceId: number;
  StudentCourseId: number;
  UserId: number;
  AttendanceDate: Date;
  AttendancePeriod: number;
  Attendances: {
    AttendanceValue: number;
    AttendanceValueCount: number;
  }[];
};

const getStudentCourseAttendancesByStudentCourseIdQuery = async (
  params: getStudentCourseAttendancesByStudentCourseIdQueryParams,
): Promise<AttendanceResult | null> => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  // First, get one record to get the basic student course attendance info
  const baseRecord = await client.studentCourseAttendances.findFirst({
    where: { StudentCourseId: params.StudentCourseId },
    select: {
      StudentCourseAttendanceId: true,
      StudentCourseId: true,
      UserId: true,
      AttendanceDate: true,
      AttendancePeriod: true,
    },
  });

  if (!baseRecord) {
    return null; // No records found
  }

  // Then, group by AttendanceValue and count occurrences
  const groupedAttendances = await client.studentCourseAttendances.groupBy({
    by: ["AttendanceValue"],
    where: { StudentCourseId: params.StudentCourseId },
    _count: {
      AttendanceValue: true,
    },
  });

  // Transform the result to match your desired structure
  const result: AttendanceResult = {
    StudentCourseAttendanceId: baseRecord.StudentCourseAttendanceId,
    StudentCourseId: baseRecord.StudentCourseId,
    UserId: baseRecord.UserId,
    AttendanceDate: baseRecord.AttendanceDate,
    AttendancePeriod: baseRecord.AttendancePeriod,
    Attendances: groupedAttendances.map((group: any) => ({
      AttendanceValue: group.AttendanceValue,
      AttendanceValueCount: group._count.AttendanceValue,
    })),
  };

  return result;
};

export default getStudentCourseAttendancesByStudentCourseIdQuery;
