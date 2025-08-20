import { PrismaClient } from "@prisma/client";
import {
  StudentCourseHomeworksByDayMap,
  StudentHomeworkAmountsByTwoWeeksViewModel,
  StudentHomeworkAmountsByTwoWeeks,
} from "../courseTextbookViewModel";

const prisma = new PrismaClient();

type getStudentHomeworkAmountsByTwoWeeksParams = {
  StudentId: number;
  TextbookDate: Date;
};

const getStudentHomeworkAmountsByTwoWeeks = async (
  params: getStudentHomeworkAmountsByTwoWeeksParams,
) => {
  const ajustedTextbookDate = new Date(params.TextbookDate);
  ajustedTextbookDate.setHours(ajustedTextbookDate.getHours() + 2);

  const textbookDateStart = new Date(ajustedTextbookDate);
  textbookDateStart.setDate(textbookDateStart.getDate() - 7); // 7 days before

  const textbookDateEnd = new Date(textbookDateStart);
  textbookDateEnd.setDate(textbookDateEnd.getDate() + 14); // 14 days after

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

  //   export type StudentHomeworkAmountsByTwoWeeks = {
  //   CourseHomeworkId: number;
  //   HomeworkDate: Date;
  //   UserId: number;
  //   UserName: string;
  // };

  // export type StudentHomeworkAmountsByTwoWeeksViewModel = {
  //   HomeworkDueDate: Date;
  //   Homeworks: number;
  // };

  // Create an intermediate mapping to help with grouping
  const groupMap: Record<string, StudentHomeworkAmountsByTwoWeeksViewModel> =
    {};

  // Process each record
  query.forEach((homework: StudentCourseHomeworksByDayMap) => {
    // const student = attendance.StudentCourses.StudentId;
    const homeworkDueDate = homework.HomeworkDueDate;

    // If this course is not in our map yet, create the base object
    if (!groupMap[homeworkDueDate.toUTCString()]) {
      groupMap[homeworkDueDate.toUTCString()] = {
        HomeworkDueDate: homework.HomeworkDueDate,
        Homeworks: [],
      };
    }

    const homeworkEntry: StudentHomeworkAmountsByTwoWeeks = {
      CourseHomeworkId: homework.CourseHomeworkId,
      HomeworkDate: homework.HomeworkDate,
      UserId: homework.UserId,
      UserName: homework.Users.UserName,
    };

    groupMap[homeworkDueDate.toUTCString()].Homeworks.push(homeworkEntry);
  });

  // Convert map to array
  const result = Object.values(groupMap);

  return result;

  // const result = query.map(
  //   (courseHomework: StudentCourseHomeworksByDayMap) => ({
  //     CourseHomeworkId: courseHomework.CourseHomeworkId,
  //     CourseId: courseHomework.CourseId,
  //     CourseCode: courseHomework.Courses.CourseCode,
  //     CourseName: courseHomework.Courses.Name,
  //     UserId: courseHomework.UserId,
  //     UserName: courseHomework.Users.UserName,
  //     HomeworkDate: courseHomework.HomeworkDate,
  //     HomeworkDueDate: courseHomework.HomeworkDueDate,
  //     Description: courseHomework.Description,
  //     ReferenceDate: courseHomework.ReferenceDate,
  //     HomeworkAmount: courseHomework.HomeworkDueDate,
  //   }),
  // );

  // return result;
};

export default getStudentHomeworkAmountsByTwoWeeks;
