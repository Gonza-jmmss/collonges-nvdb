import { PrismaClient } from "@prisma/client";
import { LevelCoursesMap } from "../levelsViewModel";

const prisma = new PrismaClient();

const getLevelByIdQuery = async (levelId: number) => {
  const query = await prisma.levels.findFirstOrThrow({
    where: { LevelId: levelId },
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

  const res = {
    LevelId: query.LevelId,
    Name: query.Name,
    IsEnabled: query.IsEnabled,
    LevelCourses: query.LevelCourses.map((levelCourse: LevelCoursesMap) => ({
      LevelCourseId: levelCourse.LevelCourseId,
      CourseId: levelCourse.CourseId,
      CourseName: levelCourse.Courses.Name,
      CourseCode: levelCourse.Courses.CourseCode,
    })),
  };

  return res;
};

export default getLevelByIdQuery;
