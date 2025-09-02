import { PrismaClient } from "@prisma/client";
import { CourseHomeworksByCourseIdAndTextbookDateMap } from "../courseTextbookViewModel";

const prisma = new PrismaClient();

type getCourseTextbookByCourseIdAndTextbookDateQueryParams = {
  CourseId: number;
  ReferenceDate: Date;
};

const getCourseTextbookByCourseIdAndTextbookDateQuery = async (
  params: getCourseTextbookByCourseIdAndTextbookDateQueryParams,
) => {
  // Normalize ReferenceDate to get full day range
  const referenceDateStart = new Date(params.ReferenceDate);
  referenceDateStart.setMilliseconds(0); // Set milliseconds to 0
  // referenceDateStart.setSeconds(referenceDateStart.getSeconds() - 1); // Previous second to create a range

  const referenceDateEnd = new Date(referenceDateStart);
  referenceDateEnd.setSeconds(referenceDateEnd.getSeconds() + 1); // Next second to create a range

  const courseContentsQuery = await prisma.courseContents.findFirstOrThrow({
    where: {
      CourseId: params.CourseId,
      ReferenceDate: {
        gte: referenceDateStart,
        lte: referenceDateEnd,
      },
    },
    orderBy: [{ Courses: { Name: "asc" } }],
    include: {
      Users: {
        select: {
          UserId: true,
          UserName: true,
        },
      },
      Courses: {
        select: {
          CourseId: true,
          Name: true,
          CourseCode: true,
        },
      },
    },
  });

  const courseHomeworksQuery = await prisma.courseHomeworks.findMany({
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

  const result = {
    CourseContentId: courseContentsQuery.CourseContentId,
    CourseId: courseContentsQuery.CourseId,
    CourseCode: courseContentsQuery.Courses.CourseCode,
    CourseName: courseContentsQuery.Courses.Name,
    UserId: courseContentsQuery.UserId,
    ContentDate: courseContentsQuery.ContentDate,
    Content: courseContentsQuery.Content,
    ReferenceDate: courseContentsQuery.ReferenceDate,
    Documents: courseContentsQuery.Documents?.split(",") || [],
    Homeworks: courseHomeworksQuery.map(
      (courseHomework: CourseHomeworksByCourseIdAndTextbookDateMap) => ({
        CourseHomeworkId: courseHomework.CourseHomeworkId,
        CourseId: courseHomework.CourseId,
        UserId: courseHomework.UserId,
        HomeworkDate: courseHomework.HomeworkDate,
        HomeworkDueDate: courseHomework.HomeworkDueDate,
        Description: courseHomework.Description,
        ReferenceDate: courseHomework.ReferenceDate,
        Documents: courseHomework.Documents?.split(",") || [],
      }),
    ),
  };

  return result;
};

export default getCourseTextbookByCourseIdAndTextbookDateQuery;
