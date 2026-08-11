import { PrismaClient } from "@prisma/client";
import { StudentCourseHomeworksByDayMap } from "../courseTextbookViewModel";

const prisma = new PrismaClient();

type getStudentCourseHomeworksByDayQueryParams = {
  StudentId: number;
  TextbookDate: Date;
};

const getStudentCourseHomeworksByDayQuery = async (
  params: getStudentCourseHomeworksByDayQueryParams,
) => {
  const ajustedTextbookDate = new Date(params.TextbookDate);
  ajustedTextbookDate.setHours(ajustedTextbookDate.getHours() + 2);

  // Normalize AttendanceDate to get full day range
  const textbookDateStart = new Date(ajustedTextbookDate);
  textbookDateStart.setUTCHours(0, 0, 0, 0);

  const textbookDateEnd = new Date(textbookDateStart);
  textbookDateEnd.setUTCHours(23, 59, 59, 999);

  const query = await prisma.courseHomeworks.findMany({
    where: {
      Courses: { StudentCourses: { some: { StudentId: params.StudentId } } },
      HomeworkDueDate: {
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
        },
      },
    },
  });

  const result = query.map(
    (courseHomework: StudentCourseHomeworksByDayMap) => ({
      CourseHomeworkId: courseHomework.CourseHomeworkId,
      CourseId: courseHomework.CourseId,
      CourseCode: courseHomework.Courses.CourseCode,
      CourseName: courseHomework.Courses.Name,
      UserId: courseHomework.UserId,
      UserName: courseHomework.Users.UserName,
      HomeworkDate: courseHomework.HomeworkDate,
      HomeworkDueDate: courseHomework.HomeworkDueDate,
      Description: courseHomework.Description,
      ReferenceDate: courseHomework.ReferenceDate,
      Documents: courseHomework.Documents?.split(",") || [],
    }),
  );

  return result;
};

export default getStudentCourseHomeworksByDayQuery;
