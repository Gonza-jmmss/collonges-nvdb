import { z } from "zod";

export const StudentCourseAttendance = z.object({
  StudentCourseAttendanceId: z.number().nullable(),
  StudentCourseId: z.number(),
  AttendanceValue: z.number().nullable(),
});

export const StudentCourseAttendancesSchema = z.object({
  UserId: z.number(),
  AttendanceDate: z.date(),
  AttendancePeriod: z.number().nullable(),
  StudentCourseAttendances: z.array(StudentCourseAttendance).nullable(),
});
