"use server";

import { PrismaClient } from "@prisma/client";
import { CourseSchema } from "@/zodSchemas/courseSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type CourseParams = z.infer<typeof CourseSchema>;

const createCourseCommand = async (params: CourseParams) => {
  const command = await prisma.courses.create({
    data: {
      Name: params.Name,
      EnglishName: params.EnglishName,
      CourseCode: params.CourseCode,
      CreditAmount: params.CreditAmount || 0,
      CoursePeriodId: params.CoursePeriodId,
      PeriodNumber: params.PeriodNumber,
      CourseTypeId: params.CourseTypeId,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default createCourseCommand;
