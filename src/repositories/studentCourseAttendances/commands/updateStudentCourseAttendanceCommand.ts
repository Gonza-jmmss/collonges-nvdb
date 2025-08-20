"use server";

import { PrismaClient } from "@prisma/client";
import {
  StudentCourseAttendancesSchema,
  StudentCourseAttendance,
} from "@/zodSchemas/studentCoursesAttendancesSchema";
import updateAttendanceOfStudentCourseCommand from "@/repositories/studentCourses/commands/updateAttendanceOfStudentCourseCommand";
import { z } from "zod";

const prisma = new PrismaClient();

type updateStudentCourseAttendanceCommandParams = z.infer<
  typeof StudentCourseAttendancesSchema
>;
type StudentCourseAttendancesMap = z.infer<typeof StudentCourseAttendance>;

const updateStudentCourseAttendanceCommand = async (
  params: updateStudentCourseAttendanceCommandParams,
) => {
  const adjustedAttendanceDate = new Date(params.AttendanceDate);
  adjustedAttendanceDate.setHours(adjustedAttendanceDate.getHours() + 2);

  let createStudentCourseAttendancesUpdated: {
    StudentCourseId: number;
    UserId: number;
    AttendanceDate: Date;
    AttendanceValue: number;
    AttendancePeriod: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
  }[] = [];

  if (
    !params.StudentCourseAttendances ||
    params.StudentCourseAttendances.length === 0 ||
    !params.UserId
  ) {
    return createStudentCourseAttendancesUpdated;
  }

  // Use Prisma transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Create an array of promises for all operations
    if (params.StudentCourseAttendances !== null) {
      const operations = params.StudentCourseAttendances.map(
        async (element: StudentCourseAttendancesMap) => {
          const createStudentCourseAttendancesUpdated = {
            StudentCourseId: element.StudentCourseId,
            AttendanceValue: element.AttendanceValue || 0,
            UserId: params.UserId,
            AttendanceDate: adjustedAttendanceDate,
            AttendancePeriod: params.AttendancePeriod || 0,
          };

          // if Student has no StudentCourseGeadeId, create new StudentCourseGeade
          if (!element.StudentCourseAttendanceId) {
            // Use the transaction client (tx) instead of prisma
            const command = await tx.studentCourseAttendances.create({
              data: createStudentCourseAttendancesUpdated,
            });

            // Update grade using the transaction client
            await updateAttendanceOfStudentCourseCommand({
              StudentCourseId: command.StudentCourseId,
              transactionClient: tx, // Pass the transaction client
            });
            return command;
          }

          // Use the transaction client (tx) instead of prisma
          const command = await tx.studentCourseAttendances.update({
            where: {
              StudentCourseAttendanceId: element.StudentCourseAttendanceId,
            },
            data: createStudentCourseAttendancesUpdated,
          });

          // Update grade using the transaction client
          await updateAttendanceOfStudentCourseCommand({
            StudentCourseId: command.StudentCourseId,
            transactionClient: tx, // Pass the transaction client
          });

          return command;
        },
      );

      // Execute all operations
      createStudentCourseAttendancesUpdated = (
        await Promise.all(operations)
      ).filter(
        (result): result is NonNullable<typeof result> => result !== null,
      );
      return createStudentCourseAttendancesUpdated;
    } else {
      return null;
    }
  });
};

export default updateStudentCourseAttendanceCommand;
