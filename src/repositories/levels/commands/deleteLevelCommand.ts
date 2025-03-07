"use server";

import { PrismaClient } from "@prisma/client";
import getLevelCoursesByLevelIdQuery from "../queries/getLevelCoursesByLevelIdQuery";

const prisma = new PrismaClient();

type DeleteLevelParams = {
  LevelId: number;
};

const deleteLevelCommand = async (params: DeleteLevelParams) => {
  const levelCourses = await getLevelCoursesByLevelIdQuery(params.LevelId);

  if (levelCourses.length > 0) {
    return await prisma.levels.update({
      where: {
        LevelId: params.LevelId,
      },
      data: {
        IsEnabled: false,
      },
    });
  } else {
    return await prisma.levels.delete({
      where: {
        LevelId: params.LevelId,
      },
    });
  }
};

export default deleteLevelCommand;
