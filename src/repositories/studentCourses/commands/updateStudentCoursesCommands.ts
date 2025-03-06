"use server";

import { PrismaClient } from "@prisma/client";
import { StudentCourseSchema } from "@/zodSchemas/studentCourses";
import getStudentCoursesByStudentIdQuery from "../queries/getStudentCoursesByStudentIdQuery";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentCorseParams = z.infer<typeof StudentCourseSchema>;

const updateStudentCourseCommand = async (params: StudentCorseParams) => {
  console.log("updateStudentCourseCommand params", params);
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
    (contact) => !paramsCoursesIds?.includes(contact),
  );

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

  // create Courses
  const createCourses = prisma.studentCourses.createMany({
    data: studentCourseToCreate,
  });

  // delete Courses
  const deleteCourses = prisma.studentCourses.deleteMany({
    where: {
      CourseId: {
        in: coursesToDelete,
      },
    },
  });

  // transaction for update data
  const transaction = await prisma.$transaction([createCourses, deleteCourses]);

  return transaction;
};

export default updateStudentCourseCommand;
