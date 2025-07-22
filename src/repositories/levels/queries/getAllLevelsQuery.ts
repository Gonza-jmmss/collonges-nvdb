import { PrismaClient } from "@prisma/client";
import { LevelsMap, LevelCoursesMap } from "../levelsViewModel";
import { PeriodEnum } from "@/enum/periodEnum";

const prisma = new PrismaClient();

type getAllLevelsQueryParamsType = {
  IsEnabled: boolean;
  PeriodNumber: number;
};

const getAllLevelsQuery = async (params: getAllLevelsQueryParamsType) => {
  const query = await prisma.levels.findMany({
    where: { IsEnabled: params.IsEnabled, PeriodNumber: params.PeriodNumber },
    include: {
      LevelCourses: {
        include: {
          Courses: {
            select: {
              CourseId: true,
              Name: true,
              EnglishName: true,
              CourseCode: true,
            },
          },
        },
      },
    },
  });

  const res = query.map((level: LevelsMap) => ({
    LevelId: level.LevelId,
    Name: level.Name,
    IsEnabled: level.IsEnabled,
    PeriodNumber: level.PeriodNumber,
    PeriodName: PeriodEnum[level.PeriodNumber],
    LevelCourses: level.LevelCourses.map((levelCourse: LevelCoursesMap) => ({
      LevelCourseId: levelCourse.LevelCourseId,
      CourseId: levelCourse.CourseId,
      CourseName: levelCourse.Courses.Name,
      CourseCode: levelCourse.Courses.CourseCode,
    })),
  }));

  return res;
};

export default getAllLevelsQuery;
