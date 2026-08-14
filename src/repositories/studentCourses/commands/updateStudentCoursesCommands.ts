// "use server";

// import { PrismaClient } from "@prisma/client";
// import { StudentCourseSchema } from "@/zodSchemas/studentCourses";
// import getStudentCoursesByStudentIdQuery from "../queries/getStudentCoursesByStudentIdQuery";
// import getStuedntCoursesGradesByStudentCourseIdsQuery from "@/repositories/studentCourseGrades/queries/getStuedntCoursesGradesByStudentCourseIdsQuery";
// import { z } from "zod";

// const prisma = new PrismaClient();

// type StudentCorseParams = z.infer<typeof StudentCourseSchema>;

// const updateStudentCourseCommand = async (params: StudentCorseParams) => {
//   // get studentCourses data of the student
//   const studentCourse = await getStudentCoursesByStudentIdQuery({
//     StudentId: params.StudentId,
//     ScholarPeriodId: params.ScholarPeriodId,
//   });

//   // creating CourseIDs arrays
//   const paramsCoursesIds = params.StudentCourses?.map((x) => x.CourseId);
//   const studentCoursesIds = studentCourse.StudentCourses.map((x) => x.CourseId);

//   // Filter the CourseIDs to create
//   const coursesToCreate = paramsCoursesIds?.filter(
//     (course) => !studentCoursesIds?.includes(course),
//   );

//   // Filter the CourseIDs to delete
//   const coursesToDelete = studentCoursesIds.filter(
//     (course) => !paramsCoursesIds?.includes(course),
//   );

//   //Filter the CourseIDs that has grades
//   const courseIdsWithGrades = studentCourse.StudentCourses.filter(
//     (x) => x.Note !== null,
//   ).map((x) => x.CourseId);
//   const coursesWithGradesToDelete = courseIdsWithGrades.filter((course) =>
//     coursesToDelete.includes(course),
//   );
//   const coursesWithOutGradesToDelete = coursesToDelete.filter(
//     (course) => !coursesWithGradesToDelete.includes(course),
//   );
//   // Getting the studentCourseGradesIds of the courses to delete
//   const studentCourseIdsWithGrade = studentCourse.StudentCourses.filter((x) =>
//     coursesWithGradesToDelete.includes(x.CourseId),
//   ).map((x) => x.StudentCourseId);

//   const studentCourseGradesIdsToDelete =
//     await getStuedntCoursesGradesByStudentCourseIdsQuery({
//       StudentCourseId: studentCourseIdsWithGrade,
//     });
//   const studentCourseAttendancesIdsToDelte =
//     await getStuedntCoursesGradesByStudentCourseIdsQuery({
//       StudentCourseId: studentCourseIdsWithGrade,
//     });

//   // Formating data to create
//   let studentCourseToCreate: {
//     StudentId: number;
//     CourseId: number;
//     Note: null;
//     ScholarPeriodId: number;
//     AttendanceScore: null;
//   }[] = [];

//   if (coursesToCreate !== null)
//     coursesToCreate?.forEach((element) => {
//       studentCourseToCreate.push({
//         StudentId: params.StudentId,
//         CourseId: element,
//         Note: null,
//         ScholarPeriodId: params.ScholarPeriodId,
//         AttendanceScore: null,
//       });
//     });

//   // create studentCourses
//   const createCourses = await prisma.studentCourses.createMany({
//     data: studentCourseToCreate,
//   });

//   // delete StudentCourseGrades
//   const deleteStudentCourseGrades = await prisma.studentCourseGrades.deleteMany(
//     {
//       where: { StudenCourseGradeId: { in: studentCourseGradesIdsToDelete } },
//     },
//   );

//   // delete StudentCourseAttendances
//   const deleStudentCourseAttendances =
//     await prisma.studentCourseAttendances.deleteMany({
//       where: {
//         StudentCourseAttendanceId: { in: studentCourseAttendancesIdsToDelte },
//       },
//     });

//   // delete Courses with no grades
//   const deleteCourses = await prisma.studentCourses.deleteMany({
//     where: {
//       StudentId: params.StudentId,
//       CourseId: {
//         in: coursesToDelete,
//       },
//     },
//   });

//   // transaction for update data
//   const transaction = await prisma.$transaction(async () => [
//     createCourses,
//     deleStudentCourseAttendances,
//     deleteStudentCourseGrades,
//     deleteCourses,
//   ]);

//   return transaction;
// };

// export default updateStudentCourseCommand;

"use server";

import { PrismaClient } from "@prisma/client";
import { StudentCourseSchema } from "@/zodSchemas/studentCourses";
import getStudentCoursesByStudentIdQuery from "../queries/getStudentCoursesByStudentIdQuery";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentCorseParams = z.infer<typeof StudentCourseSchema>;

const updateStudentCourseCommand = async (params: StudentCorseParams) => {
  // Get studentCourses data of the student
  const studentCourse = await getStudentCoursesByStudentIdQuery({
    StudentId: params.StudentId,
    ScholarPeriodId: params.ScholarPeriodId,
  });

  // Creating CourseIDs arrays
  const paramsCoursesIds = params.StudentCourses?.map((x) => x.CourseId) || [];
  const studentCoursesIds = studentCourse.StudentCourses.map((x) => x.CourseId);

  // Filter the CourseIDs to create
  const coursesToCreate = paramsCoursesIds.filter(
    (course) => !studentCoursesIds.includes(course),
  );

  // Filter the CourseIDs to delete
  const coursesToDelete = studentCoursesIds.filter(
    (course) => !paramsCoursesIds.includes(course),
  );

  // Get all StudentCourseIds that need to be deleted
  const studentCourseIdsToDelete = studentCourse.StudentCourses.filter((x) =>
    coursesToDelete.includes(x.CourseId),
  ).map((x) => x.StudentCourseId);

  // Formatting data to create
  const studentCourseToCreate = coursesToCreate.map((courseId) => ({
    StudentId: params.StudentId,
    CourseId: courseId,
    Note: null,
    ScholarPeriodId: params.ScholarPeriodId,
    AttendanceScore: null,
  }));

  // Execute all operations in a transaction
  const transaction = await prisma.$transaction(async (tx) => {
    // 1. Delete StudentCourseAttendances first (child records)
    const deletedAttendances = await tx.studentCourseAttendances.deleteMany({
      where: {
        StudentCourseId: { in: studentCourseIdsToDelete },
      },
    });

    // 2. Delete StudentCourseGrades (child records)
    const deletedGrades = await tx.studentCourseGrades.deleteMany({
      where: {
        StudentCourseId: { in: studentCourseIdsToDelete },
      },
    });

    // 3. Delete StudentCourses (parent records)
    const deletedCourses = await tx.studentCourses.deleteMany({
      where: {
        StudentCourseId: { in: studentCourseIdsToDelete },
      },
    });

    // 4. Create new StudentCourses
    const createdCourses =
      studentCourseToCreate.length > 0
        ? await tx.studentCourses.createMany({
            data: studentCourseToCreate,
          })
        : { count: 0 };

    return {
      deletedAttendances,
      deletedGrades,
      deletedCourses,
      createdCourses,
    };
  });

  return transaction;
};

export default updateStudentCourseCommand;
