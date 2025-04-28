"use server";

import { PrismaClient } from "@prisma/client";
import { CourseSchema } from "@/zodSchemas/courseSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type CourseParams = z.infer<typeof CourseSchema>;

const updateCourseCommand = async (params: CourseParams) => {
  return await prisma.courses.update({
    where: {
      CourseId: params.CourseId || 0,
    },
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
};

export default updateCourseCommand;
