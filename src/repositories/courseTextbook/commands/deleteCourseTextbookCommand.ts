"use server";

import { PrismaClient } from "@prisma/client";
import getCourseTextbookByCourseIdAndTextbookDateQuery from "../queries/getCourseTextbookByCourseIdAndTextbookDateQuery";

const prisma = new PrismaClient();

type deleteCourseTextbookCoommandParams = {
  CourseId: number;
  ReferenceDate: Date;
};

const deleteCourseTextbookCoommand = async (
  params: deleteCourseTextbookCoommandParams,
) => {
  const courseHomework = await getCourseTextbookByCourseIdAndTextbookDateQuery({
    CourseId: params.CourseId,
    ReferenceDate: params.ReferenceDate,
  });

  const homeworkIdsToDelete = courseHomework.Homeworks.map(
    (x) => x.CourseHomeworkId,
  );

  //   transaction
  try {
    return await prisma.$transaction(async (tx) => {
      // delete courseContent
      if (courseHomework) {
        await tx.courseContents.delete({
          where: {
            CourseContentId: courseHomework.CourseContentId,
          },
        });
      }

      // delete courseHomeworks
      if (courseHomework.Homeworks.length > 0) {
        await tx.courseHomeworks.deleteMany({
          where: {
            CourseHomeworkId: {
              in: homeworkIdsToDelete,
            },
          },
        });
      }

      return {
        textbookDeleted: courseHomework,
      };
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};

export default deleteCourseTextbookCoommand;
