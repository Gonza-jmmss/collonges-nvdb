"use server";

import { PrismaClient } from "@prisma/client";
import { CourseContentSchema } from "@/zodSchemas/courseTextbookSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type courseContentParams = z.infer<typeof CourseContentSchema>;

const createCourseTextbookCommand = async (params: courseContentParams) => {
  try {
    const ajustedContentDate = new Date(params.ContentDate);
    ajustedContentDate.setHours(ajustedContentDate.getHours() + 2);

    const ajustedReferenceDate = new Date(params.ReferenceDate);
    ajustedReferenceDate.setHours(ajustedReferenceDate.getHours() + 2);

    return prisma.$transaction(async (tx) => {
      const courseContentToCreate = {
        CourseId: params.CourseId,
        UserId: params.UserId,
        ContentDate: ajustedContentDate,
        Content: params.Content,
        ReferenceDate: ajustedReferenceDate,
        Documents: params.Documents?.toString(),
      };

      const courseContentCreated = await tx.courseContents.create({
        data: courseContentToCreate,
      });

      let courseHomeworkToCreate: {
        CourseId: number;
        UserId: number;
        HomeworkDate: Date;
        HomeworkDueDate: Date;
        Description: string;
        ReferenceDate: Date;
      }[] = [];

      if (params.Homeworks && params.Homeworks.length > 0) {
        params.Homeworks.forEach((element) => {
          const ajustedHomeworkDate = new Date(element.HomeworkDate);
          ajustedHomeworkDate.setHours(ajustedHomeworkDate.getHours() + 2);

          const ajustedHomeworkDueDate = new Date(element.HomeworkDueDate);
          ajustedHomeworkDueDate.setHours(
            ajustedHomeworkDueDate.getHours() + 2,
          );

          courseHomeworkToCreate.push({
            CourseId: element.CourseId,
            UserId: element.UserId,
            HomeworkDate: ajustedHomeworkDate,
            HomeworkDueDate: ajustedHomeworkDueDate,
            Description: element.Description,
            ReferenceDate: element.ReferenceDate,
          });
        });
      }

      const courseHomeworksCreated = await tx.courseHomeworks.createMany({
        data: courseHomeworkToCreate,
      });

      return {
        courseContent: courseContentCreated,
        courseHomeworks: courseHomeworksCreated,
      };
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};

export default createCourseTextbookCommand;
