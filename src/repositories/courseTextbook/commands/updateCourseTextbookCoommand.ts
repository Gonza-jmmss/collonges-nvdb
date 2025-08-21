"use server";

import { PrismaClient } from "@prisma/client";
import { CourseContentSchema } from "@/zodSchemas/courseTextbookSchema";
import getCourseHomeworksByCourseIdAndTextBookDateQuery from "../queries/getCourseHomeworksByCourseIdAndTextBookDateQuery";
import { z } from "zod";

const prisma = new PrismaClient();

type courseContentParams = z.infer<typeof CourseContentSchema>;

const updateCourseTextbookCoommand = async (params: courseContentParams) => {
  const courseHomeworks =
    await getCourseHomeworksByCourseIdAndTextBookDateQuery({
      CourseId: params.CourseId,
      ReferenceDate: params.ReferenceDate,
    });

  // creating ModuleElementsIDs arrays
  const paramsCourseHomeworksIds = params.Homeworks?.map(
    (x) => x.CourseHomeworkId,
  );
  const CourseHomeworksIds = courseHomeworks.map((x) => x.CourseHomeworkId);

  // courseHomeworks to create
  const courseHomeworksToCreate = params.Homeworks?.filter(
    (homework) => homework.CourseHomeworkId === null,
  );

  // courseHomeworks to delete
  const courseHomeworkIdsToDelete = CourseHomeworksIds.filter(
    (homework) => !paramsCourseHomeworksIds?.includes(homework),
  );

  // courseHomeworks to update
  const courseHomeworksIdsToUpdate = paramsCourseHomeworksIds?.filter(
    (homeworkFilter) =>
      homeworkFilter !== null &&
      !paramsCourseHomeworksIds.some(
        (homeworkSome) =>
          homeworkSome && courseHomeworkIdsToDelete.includes(homeworkSome),
      ),
  );

  const courseHomeworksToUpdate = params.Homeworks?.filter(
    (homeworkFiler) =>
      homeworkFiler.CourseHomeworkId !== null &&
      params.Homeworks?.some((homeworkSome) =>
        courseHomeworksIdsToUpdate?.includes(homeworkSome.CourseHomeworkId),
      ),
  );

  // console.log("courseHomeworksToCreate", courseHomeworksToCreate);
  // console.log("courseHomeworkIdsToDelete", courseHomeworkIdsToDelete);
  // console.log("courseHomeworksToUpdate", courseHomeworksToUpdate);
  // // return 1;

  const ajustedContentDate = new Date(params.ContentDate);
  ajustedContentDate.setHours(ajustedContentDate.getHours() + 2);

  // transaction
  try {
    return await prisma.$transaction(async (tx) => {
      // update courseContenu
      await tx.courseContents.update({
        where: { CourseContentId: params.CourseContentId || 0 },
        data: {
          CourseId: params.CourseId,
          UserId: params.UserId,
          ContentDate: ajustedContentDate,
          Content: params.Content,
          Documents: params.Documents?.toString(),
        },
      });

      // create courseHomeworks
      if (courseHomeworksToCreate && courseHomeworksToCreate.length > 0) {
        // Use Promise.all with map instead of forEach
        await Promise.all(
          courseHomeworksToCreate.map(async (element) => {
            const ajustedHomeworkDate = new Date(element.HomeworkDate);
            ajustedHomeworkDate.setHours(ajustedHomeworkDate.getHours() + 2);

            const ajustedHomeworkDueDate = new Date(element.HomeworkDueDate);
            ajustedHomeworkDate.setHours(ajustedHomeworkDate.getHours() + 2);

            return await tx.courseHomeworks.create({
              data: {
                CourseId: element.CourseId,
                UserId: element.UserId,
                HomeworkDate: ajustedHomeworkDate,
                HomeworkDueDate: ajustedHomeworkDueDate,
                Description: element.Description,
                ReferenceDate: element.ReferenceDate,
              },
            });
          }),
        );
      }

      // delete courseHomeworks
      if (courseHomeworkIdsToDelete.length > 0) {
        await tx.courseHomeworks.deleteMany({
          where: {
            CourseHomeworkId: {
              in: courseHomeworkIdsToDelete,
            },
          },
        });
      }

      // update courseHomeworks
      if (courseHomeworksToUpdate && courseHomeworksToUpdate.length > 0) {
        // Use Promise.all with map instead of forEach
        await Promise.all(
          courseHomeworksToUpdate.map(async (element) => {
            return await tx.courseHomeworks.update({
              where: { CourseHomeworkId: element.CourseHomeworkId || 0 },
              data: {
                CourseId: element.CourseId,
                UserId: element.UserId,
                HomeworkDate: element.HomeworkDate,
                HomeworkDueDate: element.HomeworkDueDate,
                Description: element.Description,
              },
            });
          }),
        );
      }

      return {
        courseHomeworksCreated: courseHomeworksToCreate,
        courseHomeworksUpdated: courseHomeworksToUpdate,
        courseHomeworksDeleted: courseHomeworkIdsToDelete,
      };
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};

export default updateCourseTextbookCoommand;
