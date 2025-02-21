"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { CourseElementsMapViewModel } from "../coursesViewModel";

const prisma = new PrismaClient();

type getAllCoursesQueryParamsType = {
  IsEnabled: boolean;
  Period: number;
};

const getAllCoursesQuery = cache(
  async (params: getAllCoursesQueryParamsType) => {
    const query = await prisma.courses.findMany({
      where: {
        IsEnabled: params.IsEnabled,
        ...(params.Period !== 0 && { PeriodNumber: params.Period }),
      },
      include: {
        CoursePeriods: true,
      },
    });

    const res = query.map((course: CourseElementsMapViewModel) => ({
      CourseId: course.CourseId,
      Name: course.Name,
      EnglishName: course.EnglishName,
      CourseCode: course.CourseCode,
      CreditAmount: course.CreditAmount,
      CoursePeriodId: course.CoursePeriodId,
      CoursePeriodName: course.CoursePeriods?.Name,
      PeriodNumber: course.PeriodNumber,
      CourseTypeId: course.CourseTypeId,
      IsEnabled: course.IsEnabled,
    }));

    return res;
  },
);

export default getAllCoursesQuery;
