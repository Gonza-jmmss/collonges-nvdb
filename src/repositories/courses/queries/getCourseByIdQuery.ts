import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCourseByIdQuery = async (CourseId: number) => {
  return await prisma.courses.findFirstOrThrow({
    where: { CourseId: CourseId },
  });
};

export default getCourseByIdQuery;
