"use server";

import { PrismaClient } from "@prisma/client";
import getCourseByIdQuery from "@/repositories/courses/queries/getCourseByIdQuery";

const prisma = new PrismaClient();

type deleteCourseParamsType = {
  CourseId: number;
};

const disableCourseCommand = async (params: deleteCourseParamsType) => {
  if (params.CourseId !== null) {
    const command = await prisma.courses.update({
      where: { CourseId: params.CourseId },
      data: {
        IsEnabled: false,
      },
    });

    const student = getCourseByIdQuery(command.CourseId);

    return student;
  } else return null;
};

export default disableCourseCommand;
