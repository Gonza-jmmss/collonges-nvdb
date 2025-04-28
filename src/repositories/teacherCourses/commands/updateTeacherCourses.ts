"use server";

import { PrismaClient } from "@prisma/client";
import { TeacherCourseSchema } from "@/zodSchemas/teacherCoursesSchema";
import getTeacherCoursesByIdQuery from "../queries/getTeacherCoursesByIdQuery";
import { z } from "zod";

const prisma = new PrismaClient();

type TeacherCorseParams = z.infer<typeof TeacherCourseSchema>;

const updateTeacherCourseCommand = async (params: TeacherCorseParams) => {
  console.log("updateTeacherCourseCommand params", params);
  // get teacherCourses data of the teacher
  const teacherCourse = await getTeacherCoursesByIdQuery({
    UserId: params.UserId,
  });

  // creating CourseIDs arrays
  const paramsCoursesIds = params.TeacherCourses?.map((x) => x.CourseId);
  const teacherCoursesIds = teacherCourse.TeacherCourses.map((x) => x.CourseId);

  // Filter the CourseIDs to create
  const coursesToCreate = paramsCoursesIds?.filter(
    (course) => !teacherCoursesIds?.includes(course),
  );

  // Filter the CourseIDs to delete
  const coursesToDelete = teacherCoursesIds.filter(
    (contact) => !paramsCoursesIds?.includes(contact),
  );

  // Formating data to create
  let teacherCourseToCreate: {
    UserId: number;
    CourseId: number;
  }[] = [];

  if (coursesToCreate !== null)
    coursesToCreate?.forEach((element) => {
      teacherCourseToCreate.push({
        UserId: params.UserId,
        CourseId: element,
      });
    });

  // create Courses
  const createCourses = prisma.teacherCourses.createMany({
    data: teacherCourseToCreate,
  });

  // delete Courses
  const deleteCourses = prisma.teacherCourses.deleteMany({
    where: {
      UserId: params.UserId,
      CourseId: {
        in: coursesToDelete,
      },
    },
  });

  // transaction for update data
  const transaction = await prisma.$transaction([createCourses, deleteCourses]);

  return transaction;
};

export default updateTeacherCourseCommand;
