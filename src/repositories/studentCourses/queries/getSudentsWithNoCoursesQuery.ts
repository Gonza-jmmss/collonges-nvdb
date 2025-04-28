import { PrismaClient } from "@prisma/client";
import { StudentsWithNoCoursesMap } from "../studentCoursesViewModel";

const prisma = new PrismaClient();

const getStudentsWithNoCoursesQuery = async () => {
  const query = await prisma.students.findMany({
    orderBy: [{ Persons: { AlternativeName: "asc" } }],
    where: { IsEnabled: true, StudentCourses: { none: {} } },
    include: {
      Persons: {
        select: {
          AlternativeName: true,
        },
      },
      StudentCourses: true,
    },
  });

  const res = query.map((student: StudentsWithNoCoursesMap) => ({
    StudentId: student.StudentId,
    AlternativeName: student.Persons.AlternativeName,
  }));

  return res;
};

export default getStudentsWithNoCoursesQuery;

// import { PrismaClient } from "@prisma/client";
// import { StudentsWithNoCoursesMap } from "../studentCoursesViewModel";

// const prisma = new PrismaClient();

// type getStudentsWithNoCoursesQueryParamsType = {
//   ScholarPeriodId: number;
//   ScholarYearId?: number;
// };

// const getStudentsWithNoCoursesQuery = async (
//   params: getStudentsWithNoCoursesQueryParamsType,
// ) => {
//   const query = await prisma.students.findMany({
//     orderBy: [{ Persons: { AlternativeName: "asc" } }],
//     // where: { IsEnabled: true, StudentCourses: { none: {} } },
//     where: {
//       IsEnabled: true,
//       StudentCourses: {
//         // some: {
//         //   ScholarPeriods: {
//         //     ScholarPeriodId: params.ScholarPeriodId,
//         //     // ScholarYearId: params.ScholarYearId,
//         //     ...(params.ScholarYearId &&
//         //       params.ScholarYearId !== null && {
//         //         ScholarYearId: params.ScholarYearId,
//         //       }),
//         //   },
//         // },
//         none: {},
//       },
//     },
//     include: {
//       Persons: {
//         select: {
//           AlternativeName: true,
//         },
//       },
//       StudentCourses: {
//         where: {
//           ScholarPeriods: {
//             ScholarPeriodId: params.ScholarPeriodId,
//             // ScholarYearId: params.ScholarYearId,
//             ...(params.ScholarYearId &&
//               params.ScholarYearId !== null && {
//                 ScholarYearId: params.ScholarYearId,
//               }),
//           },
//         },
//       },
//     },
//   });

//   const res = query.map((student: StudentsWithNoCoursesMap) => ({
//     StudentId: student.StudentId,
//     AlternativeName: student.Persons.AlternativeName,
//   }));

//   return res;
// };

// export default getStudentsWithNoCoursesQuery;
