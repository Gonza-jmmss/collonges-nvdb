"use server";

import { PrismaClient } from "@prisma/client";
import { LevelSchema } from "@/zodSchemas/levelSchema";
import getLevelCoursesByLevelIdQuery from "../queries/getLevelCoursesByLevelIdQuery";
import updateLevelCommand from "./updateLevelCommand";
import { z } from "zod";

const prisma = new PrismaClient();

type LevelParams = z.infer<typeof LevelSchema>;

const updateLevelWithCoursesCommand = async (params: LevelParams) => {
  // get levelCourses data of the level
  const levelCourses = await getLevelCoursesByLevelIdQuery(params.LevelId);

  // creating CourseIDs arrays
  const paramsCoursesIds = params.LevelCourses?.map((x) => x.CourseId);
  const levelCoursesIds = levelCourses.map((x) => x.CourseId);

  // Filter the CourseIDs to create
  const coursesToCreate = paramsCoursesIds?.filter(
    (course) => !levelCoursesIds?.includes(course),
  );

  // Filter the CourseIDs to delete
  const coursesToDelete = levelCoursesIds.filter(
    (contact) => !paramsCoursesIds?.includes(contact),
  );

  // Formating data to create
  let levelCoursesToCreate: {
    LevelId: number;
    CourseId: number;
  }[] = [];

  if (coursesToCreate !== null)
    coursesToCreate?.forEach((element) => {
      levelCoursesToCreate.push({
        LevelId: params.LevelId,
        CourseId: element,
      });
    });

  // update level
  const updateLevelData = updateLevelCommand(params);

  // delete createCourses
  const levelCoursesCreated = prisma.levelCourses.createMany({
    data: levelCoursesToCreate,
  });

  // delete LevelCourses
  const levelCoursesDeleted = prisma.levelCourses.deleteMany({
    where: {
      LevelId: params.LevelId,
      CourseId: {
        in: coursesToDelete,
      },
    },
  });

  // transaction for update data
  const transaction = await prisma.$transaction([
    updateLevelData,
    levelCoursesCreated,
    levelCoursesDeleted,
  ]);

  return transaction;
};

export default updateLevelWithCoursesCommand;
