import { PrismaClient } from "@prisma/client";
import { LevelCoursesMap } from "../levelsViewModel";

const prisma = new PrismaClient();

const getLevelCoursesByLevelIdQuery = async (levelId: number) => {
  const query = await prisma.levelCourses.findMany({
    where: { LevelId: levelId },
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
  });

  const res = query.map((levelCourse: LevelCoursesMap) => ({
    LevelCourseId: levelCourse.LevelCourseId,
    CourseId: levelCourse.CourseId,
    CourseName: levelCourse.Courses.Name,
    CourseCode: levelCourse.Courses.CourseCode,
  }));

  return res;
};

export default getLevelCoursesByLevelIdQuery;
