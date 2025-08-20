import { PrismaClient } from "@prisma/client";
import { CourseHomeworksByCourseIdAndTextbookDateMap } from "../courseTextbookViewModel";

const prisma = new PrismaClient();

type getCourseHomeworksByCourseIdAndTextBookDateQueryParams = {
  CourseId: number;
  ReferenceDate: Date;
};

const getCourseHomeworksByCourseIdAndTextBookDateQuery = async (
  params: getCourseHomeworksByCourseIdAndTextBookDateQueryParams,
) => {
  const ajustedTextbookDate = new Date(params.ReferenceDate);
  ajustedTextbookDate.setHours(ajustedTextbookDate.getHours() + 2);

  // Normalize ReferenceDate to get full day range
  const referenceDateStart = new Date(ajustedTextbookDate);
  referenceDateStart.setMilliseconds(0); // Set milliseconds to 0

  const referenceDateEnd = new Date(referenceDateStart);
  referenceDateEnd.setSeconds(referenceDateEnd.getSeconds() + 1); // Next second to create a range

  const query = await prisma.courseHomeworks.findMany({
    where: {
      CourseId: params.CourseId,
      ReferenceDate: {
        gte: referenceDateStart,
        lte: referenceDateEnd,
      },
    },
    orderBy: [{ Courses: { Name: "asc" } }],
    include: {
      Courses: {
        select: {
          CourseId: true,
          Name: true,
          CourseCode: true,
        },
      },
    },
  });

  const result = query.map(
    (courseHomework: CourseHomeworksByCourseIdAndTextbookDateMap) => ({
      CourseHomeworkId: courseHomework.CourseHomeworkId,
      CourseId: courseHomework.CourseId,
      UserId: courseHomework.UserId,
      HomeworkDate: courseHomework.HomeworkDate,
      HomeworkDueDate: courseHomework.HomeworkDueDate,
      Description: courseHomework.Description,
      ReferenceDate: courseHomework.ReferenceDate,
    }),
  );

  return result;
};

export default getCourseHomeworksByCourseIdAndTextBookDateQuery;
