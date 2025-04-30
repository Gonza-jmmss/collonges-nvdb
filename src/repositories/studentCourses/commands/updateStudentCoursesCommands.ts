"use server";

import { PrismaClient } from "@prisma/client";
import { StudentCourseSchema } from "@/zodSchemas/studentCourses";
import getStudentCoursesByStudentIdQuery from "../queries/getStudentCoursesByStudentIdQuery";
import getStuedntCoursesGradesByStudentCourseIdsQuery from "@/repositories/studentCourseGrades/queries/getStuedntCoursesGradesByStudentCourseIdsQuery";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentCorseParams = z.infer<typeof StudentCourseSchema>;

const updateStudentCourseCommand = async (params: StudentCorseParams) => {
  // get studentCourses data of the student
  const studentCourse = await getStudentCoursesByStudentIdQuery({
    StudentId: params.StudentId,
    ScholarPeriodId: params.ScholarPeriodId,
  });

  // creating CourseIDs arrays
  const paramsCoursesIds = params.StudentCourses?.map((x) => x.CourseId);
  const studentCoursesIds = studentCourse.StudentCourses.map((x) => x.CourseId);

  // Filter the CourseIDs to create
  const coursesToCreate = paramsCoursesIds?.filter(
    (course) => !studentCoursesIds?.includes(course),
  );

  // Filter the CourseIDs to delete
  const coursesToDelete = studentCoursesIds.filter(
    (course) => !paramsCoursesIds?.includes(course),
  );

  //Filter the CourseIDs that has grades
  const courseIdsWithGrades = studentCourse.StudentCourses.filter(
    (x) => x.Note !== null,
  ).map((x) => x.CourseId);
  const coursesWithGradesToDelete = courseIdsWithGrades.filter((course) =>
    coursesToDelete.includes(course),
  );
  const coursesWithOutGradesToDelete = coursesToDelete.filter(
    (course) => !coursesWithGradesToDelete.includes(course),
  );
  // Getting the studentCourseGradesIds of the courses to delete
  const studentCourseIdsWithGrade = studentCourse.StudentCourses.filter((x) =>
    coursesWithGradesToDelete.includes(x.CourseId),
  ).map((x) => x.StudentCourseId);
  const studentCourseGradesIdsToDelete =
    await getStuedntCoursesGradesByStudentCourseIdsQuery({
      StudentCourseId: studentCourseIdsWithGrade,
    });

  // Formating data to create
  let studentCourseToCreate: {
    StudentId: number;
    CourseId: number;
    Note: null;
    ScholarPeriodId: number;
  }[] = [];

  if (coursesToCreate !== null)
    coursesToCreate?.forEach((element) => {
      studentCourseToCreate.push({
        StudentId: params.StudentId,
        CourseId: element,
        Note: null,
        ScholarPeriodId: params.ScholarPeriodId,
      });
    });

  // create studentCourses
  const createCourses = prisma.studentCourses.createMany({
    data: studentCourseToCreate,
  });

  // delete StudentCourseGrades
  const deleteStudentCourseGrades = prisma.studentCourseGrades.deleteMany({
    where: { StudenCourseGradeId: { in: studentCourseGradesIdsToDelete } },
  });

  // delete Courses with no grades
  const deleteCourses = prisma.studentCourses.deleteMany({
    where: {
      StudentId: params.StudentId,
      CourseId: {
        in: coursesToDelete,
      },
    },
  });

  // transaction for update data
  const transaction = await prisma.$transaction([
    createCourses,
    deleteStudentCourseGrades,
    deleteCourses,
  ]);

  return transaction;
};

export default updateStudentCourseCommand;
