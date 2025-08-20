import { PrismaClient } from "@prisma/client";
import { CourseContentsMap } from "../courseTextbookViewModel";

const prisma = new PrismaClient();

type getStudentCourseContentsByDayQueryParams = {
  StudentId: number;
  TextbookDate: Date;
};

const getStudentCourseContentsByDayQuery = async (
  params: getStudentCourseContentsByDayQueryParams,
) => {
  const ajustedTextbookDate = new Date(params.TextbookDate);
  ajustedTextbookDate.setHours(ajustedTextbookDate.getHours() + 2);

  // Normalize AttendanceDate to get full day range
  const textbookDateStart = new Date(ajustedTextbookDate);
  textbookDateStart.setUTCHours(0, 0, 0, 0);

  const textbookDateEnd = new Date(textbookDateStart);
  textbookDateEnd.setUTCHours(23, 59, 59, 999);

  const query = await prisma.courseContents.findMany({
    where: {
      Courses: { StudentCourses: { some: { StudentId: params.StudentId } } },
      ContentDate: {
        gte: textbookDateStart,
        lte: textbookDateEnd,
      },
    },
    orderBy: [{ ReferenceDate: "asc" }],
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
          LevelCourses: {
            where: { Levels: { IsEnabled: true } },
            include: {
              Levels: {
                select: {
                  LevelId: true,
                  Name: true,
                },
              },
            },
            orderBy: {
              Levels: { Name: "asc" },
            },
          },
        },
      },
    },
  });

  const result = query.map((courseContent: CourseContentsMap) => ({
    CourseContentId: courseContent.CourseContentId,
    CourseId: courseContent.CourseId,
    CourseName: courseContent.Courses.Name,
    CourseCode: courseContent.Courses.CourseCode,
    LevelId: courseContent.Courses.LevelCourses[0].LevelId,
    LevelName: courseContent.Courses.LevelCourses[0].Levels.Name,
    UserId: courseContent.UserId,
    UserName: courseContent.Users.UserName,
    ContentDate: courseContent.ContentDate,
    Content: courseContent.Content,
    ReferenceDate: courseContent.ReferenceDate,
  }));

  return result;
};

export default getStudentCourseContentsByDayQuery;
