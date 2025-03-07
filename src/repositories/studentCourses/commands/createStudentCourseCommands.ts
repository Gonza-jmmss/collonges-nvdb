"use server";

import { PrismaClient } from "@prisma/client";
import { StudentCourseSchema } from "@/zodSchemas/studentCourses";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentCorseParams = z.infer<typeof StudentCourseSchema>;

const createStudentCourseCommand = async (params: StudentCorseParams) => {
  let studentCourseToCreate: {
    StudentId: number;
    CourseId: number;
    Note: null;
    ScholarPeriodId: number;
  }[] = [];

  if (params.StudentCourses && params.StudentCourses.length > 0) {
    params.StudentCourses.forEach((element) => {
      studentCourseToCreate.push({
        StudentId: params.StudentId,
        CourseId: element.CourseId,
        Note: null,
        ScholarPeriodId: params.ScholarPeriodId,
      });
    });
  }

  const command = await prisma.studentCourses.createMany({
    data: studentCourseToCreate,
  });

  return command;
};

export default createStudentCourseCommand;
