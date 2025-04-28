"use server";

import { PrismaClient } from "@prisma/client";
import { LevelSchema } from "@/zodSchemas/levelSchema";
import createLevelCommand from "./createLevelCommand";
import { z } from "zod";

const prisma = new PrismaClient();

type LevelParams = z.infer<typeof LevelSchema>;

const createLevelWithCoursesCommand = async (params: LevelParams) => {
  try {
    const result = await prisma.$transaction(async () => {
      const levelCreated = await createLevelCommand(params);

      let levelCoursesToCreate: {
        LevelId: number;
        CourseId: number;
      }[] = [];

      if (params.LevelCourses && params.LevelCourses.length > 0) {
        params.LevelCourses.forEach((element) => {
          levelCoursesToCreate.push({
            LevelId: levelCreated.LevelId,
            CourseId: element.CourseId,
          });
        });
      }

      const levelCoursesCreated = await prisma.levelCourses.createMany({
        data: levelCoursesToCreate,
      });

      return {
        level: levelCreated,
        levelCoursesToCreate: levelCoursesCreated,
      };
    });

    return result;
  } catch (error) {
    console.error("Transaction failed", error);
    throw error; // or handle the error as needed
  }
};

export default createLevelWithCoursesCommand;
