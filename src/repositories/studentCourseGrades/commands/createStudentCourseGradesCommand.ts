"use server";

import { PrismaClient } from "@prisma/client";
import {
  StudentCourseGradeSchema,
  StudentCourseGrade,
} from "@/zodSchemas/studentCourseGradeSchema";
import updateGradeOfSudentCourseCommand from "@/repositories/studentCourses/commands/updateGradeOfSudentCourseCommand";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentCourseGradeParams = z.infer<typeof StudentCourseGradeSchema>;
type StudentCoursesMap = z.infer<typeof StudentCourseGrade>;

const createStudentCourseGradesCommand = async (
  params: StudentCourseGradeParams,
) => {
  let studentCourseGradesCreated: {
    GradeCoefficientId: number;
    UserId: number;
    Description: string;
    StudentCourseId: number;
    Grade: string;
    StudenCourseGradeId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
  }[] = [];

  if (!params.StudentCourses || params.StudentCourses.length === 0) {
    return studentCourseGradesCreated;
  }

  // Use Prisma transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Create an array of promises for all operations
    if (params.StudentCourses !== null) {
      const operations = params.StudentCourses.map(
        async (element: StudentCoursesMap) => {
          const studentCourseGradeToCreate = {
            StudentCourseId: element.StudentCourseId || 0,
            Grade: (element.Grade !== null
              ? element.Grade
              : NaN
            ).toLocaleString(),
            GradeCoefficientId: params.GradeCoefficientId || 0,
            UserId: params.UserId || 0,
            Description: params.Description || "",
          };

          // Use the transaction client (tx) instead of prisma
          const command = await tx.studentCourseGrades.create({
            data: studentCourseGradeToCreate,
          });

          // Update grade using the transaction client
          await updateGradeOfSudentCourseCommand({
            StudentCourseId: command.StudentCourseId,
            transactionClient: tx, // Pass the transaction client
          });

          return command;
        },
      );

      // Execute all operations
      studentCourseGradesCreated = await Promise.all(operations);
      return studentCourseGradesCreated;
    } else {
      return "error";
    }
  });
};

export default createStudentCourseGradesCommand;
