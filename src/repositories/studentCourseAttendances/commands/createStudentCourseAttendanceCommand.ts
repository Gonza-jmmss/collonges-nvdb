"use server";

import { PrismaClient } from "@prisma/client";
import {
  StudentCourseAttendancesSchema,
  StudentCourseAttendance,
} from "@/zodSchemas/studentCoursesAttendancesSchema";
import updateAttendanceOfStudentCourseCommand from "@/repositories/studentCourses/commands/updateAttendanceOfStudentCourseCommand";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentCourseAttendanceParams = z.infer<
  typeof StudentCourseAttendancesSchema
>;
type StudentCourseAttendancesMap = z.infer<typeof StudentCourseAttendance>;

const createStudentCourseAttendanceCommand = async (
  params: StudentCourseAttendanceParams,
) => {
  const adjustedAttendanceDate = new Date(params.AttendanceDate);
  adjustedAttendanceDate.setHours(adjustedAttendanceDate.getHours() + 2);

  let createStudentCourseAttendancesCreated: {
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
    return createStudentCourseAttendancesCreated;
  }

  params.StudentCourseAttendances.map((x) => {
    if (!x.StudentCourseId) return createStudentCourseAttendancesCreated;
  });

  // Use Prisma transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Create an array of promises for all operations
    if (params.StudentCourseAttendances !== null) {
      const operations = params.StudentCourseAttendances.map(
        async (element: StudentCourseAttendancesMap) => {
          const studentCourseGradeToCreate = {
            StudentCourseId: element.StudentCourseId,
            AttendanceValue: element.AttendanceValue || 0,
            UserId: params.UserId,
            AttendanceDate: adjustedAttendanceDate,
            AttendancePeriod: params.AttendancePeriod || 0,
          };

          // Use the transaction client (tx) instead of prisma
          const command = await tx.studentCourseAttendances.create({
            data: studentCourseGradeToCreate,
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
      createStudentCourseAttendancesCreated = await Promise.all(operations);
      return createStudentCourseAttendancesCreated;
    } else {
      return "error";
    }
  });
};

export default createStudentCourseAttendanceCommand;
