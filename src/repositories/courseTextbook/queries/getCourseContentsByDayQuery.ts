// import { PrismaClient } from "@prisma/client";
// import { CourseContentsMap } from "../courseTextbookViewModel";

// const prisma = new PrismaClient();

// type getCourseContentsByDayQueryParams = {
//   TextbookDate: Date;
// };

// const getCourseContentsByDayQuery = async (
//   params: getCourseContentsByDayQueryParams,
// ) => {
//   const ajustedTextbookDate = new Date(params.TextbookDate);
//   ajustedTextbookDate.setHours(ajustedTextbookDate.getHours() + 2);

//   // Normalize AttendanceDate to get full day range
//   const textbookDateStart = new Date(ajustedTextbookDate);
//   textbookDateStart.setUTCHours(0, 0, 0, 0);

//   const textbookDateEnd = new Date(textbookDateStart);
//   textbookDateEnd.setUTCHours(23, 59, 59, 999);

//   const query = await prisma.courseContents.findMany({
//     where: {
//       ContentDate: {
//         gte: textbookDateStart,
//         lte: textbookDateEnd,
//       },
//     },
//     orderBy: [{ ReferenceDate: "asc" }],
//     include: {
//       Users: {
//         select: {
//           UserId: true,
//           UserName: true,
//         },
//       },
//       Courses: {
//         select: {
//           CourseId: true,
//           Name: true,
//           CourseCode: true,
//           LevelCourses: {
//             where: { Levels: { IsEnabled: true } },
//             include: {
//               Levels: {
//                 select: {
//                   LevelId: true,
//                   Name: true,
//                 },
//               },
//             },
//             orderBy: {
//               Levels: { Name: "asc" },
//             },
//           },
//         },
//       },
//     },
//   });

//   const result = query.map((courseContent: CourseContentsMap) => ({
//     CourseContentId: courseContent.CourseContentId,
//     CourseId: courseContent.CourseId,
//     CourseName: courseContent.Courses.Name,
//     CourseCode: courseContent.Courses.CourseCode,
//     LevelId:
//       courseContent.Courses.LevelCourses.length === 1
//         ? courseContent.Courses.LevelCourses[0].Levels.LevelId
//         : null,
//     LevelName:
//       courseContent.Courses.LevelCourses.length === 1
//         ? courseContent.Courses.LevelCourses[0].Levels.Name
//         : "",
//     UserId: courseContent.UserId,
//     UserName: courseContent.Users.UserName,
//     ContentDate: courseContent.ContentDate,
//     Content: courseContent.Content,
//     ReferenceDate: courseContent.ReferenceDate,
//   }));

//   return result;
// };

// export default getCourseContentsByDayQuery;

import { PrismaClient } from "@prisma/client";
import {
  CourseContentsMap,
  CourseContentsByDayViewModel,
  CourseTextbooksByDay,
} from "../courseTextbookViewModel";

const prisma = new PrismaClient();

type getCourseContentsByDayQueryParams = {
  TextbookDate: Date;
};

const getCourseContentsByDayQuery = async (
  params: getCourseContentsByDayQueryParams,
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

  // const result = query.map((courseContent: CourseContentsMap) => ({
  //   CourseContentId: courseContent.CourseContentId,
  //   CourseId: courseContent.CourseId,
  //   CourseName: courseContent.Courses.Name,
  //   CourseCode: courseContent.Courses.CourseCode,
  //   LevelId:
  //     courseContent.Courses.LevelCourses.length === 1
  //       ? courseContent.Courses.LevelCourses[0].Levels.LevelId
  //       : null,
  //   LevelName:
  //     courseContent.Courses.LevelCourses.length === 1
  //       ? courseContent.Courses.LevelCourses[0].Levels.Name
  //       : "",
  //   UserId: courseContent.UserId,
  //   UserName: courseContent.Users.UserName,
  //   ContentDate: courseContent.ContentDate,
  //   Content: courseContent.Content,
  //   ReferenceDate: courseContent.ReferenceDate,
  // }));

  // Create a map to group by level
  const levelMap: Record<number, CourseContentsByDayViewModel> = {};
  // Create a separate group for courses without levels
  let coursesWithoutLevel: CourseContentsByDayViewModel | undefined = undefined;

  // Process each courseTextbook record
  query.forEach((courseTextbook: CourseContentsMap) => {
    const course = courseTextbook.Courses;

    // Create courseTextbook entry
    const courseTextbookEntry: CourseTextbooksByDay = {
      CourseContentId: courseTextbook.CourseContentId,
      CourseId: courseTextbook.CourseId,
      CourseName: courseTextbook.Courses.Name,
      CourseCode: courseTextbook.Courses.CourseCode,
      LevelId:
        courseTextbook.Courses.LevelCourses.length === 1
          ? courseTextbook.Courses.LevelCourses[0].Levels.LevelId
          : null,
      LevelName:
        courseTextbook.Courses.LevelCourses.length === 1
          ? courseTextbook.Courses.LevelCourses[0].Levels.Name
          : "",
      UserId: courseTextbook.UserId,
      UserName: courseTextbook.Users.UserName,
      ContentDate: courseTextbook.ContentDate,
      Content: courseTextbook.Content,
      ReferenceDate: courseTextbook.ReferenceDate,
    };

    // Check if course has levels
    if (course.LevelCourses.length === 0) {
      // Course has no levels - add to the "without level" group
      if (!coursesWithoutLevel) {
        coursesWithoutLevel = {
          LevelName: "Cours optionneles",
          LevelCourses: [],
          CourseTextbooks: [],
        };
      }

      // Check for duplicates in courses without level
      // const existingEntry = coursesWithoutLevel.CourseTextbooks.find(
      //   (att) =>
      //     att.CourseId === courseTextbookEntry.CourseId &&
      //     att.UserId === courseTextbookEntry.UserId,
      // );

      // if (!existingEntry) {
      //   coursesWithoutLevel.CourseTextbooks.push(courseTextbookEntry);
      // }
      coursesWithoutLevel.CourseTextbooks.push(courseTextbookEntry);
    } else {
      // Process each level that this course belongs to
      course.LevelCourses.forEach((levelCourse) => {
        const level = levelCourse.Levels;
        const levelId = level.LevelId;

        // Initialize level group if it doesn't exist
        if (!levelMap[levelId]) {
          levelMap[levelId] = {
            LevelName: level.Name,
            LevelCourses: course.LevelCourses.map((lc) => ({
              Level: lc.Levels.Name,
            })),
            CourseTextbooks: [],
          };
        }

        // Check if this attendance entry already exists for this level
        // (to avoid duplicates when a course belongs to multiple levels)
        // const existingEntry = levelMap[levelId].CourseTextbooks.find(
        //   (att) =>
        //     att.CourseId === courseTextbookEntry.CourseId &&
        //     att.UserId === courseTextbookEntry.UserId,
        // );

        // if (!existingEntry) {
        //   levelMap[levelId].CourseTextbooks.push(courseTextbookEntry);
        // }
        levelMap[levelId].CourseTextbooks.push(courseTextbookEntry);
      });
    }
  });

  // Convert map to array and sort by level name
  const result = Object.values(levelMap).sort((a, b) =>
    a.LevelName.localeCompare(b.LevelName),
  );

  if (coursesWithoutLevel) {
    result.push(coursesWithoutLevel);
  }

  return result;
};

export default getCourseContentsByDayQuery;
