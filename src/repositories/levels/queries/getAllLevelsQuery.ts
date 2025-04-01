import { PrismaClient } from "@prisma/client";
import { LevelsMap, LevelCoursesMap } from "../levelsViewModel";

const prisma = new PrismaClient();

type getAllLevelsQueryParamsType = {
  IsEnabled: boolean;
};

const getAllLevelsQuery = async (params: getAllLevelsQueryParamsType) => {
  const query = await prisma.levels.findMany({
    where: { IsEnabled: params.IsEnabled },
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
