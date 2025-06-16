import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type getStudentHasUserQueryParams = {
  StudentId: number;
};

const getStudentHasUserQuery = async (params: getStudentHasUserQueryParams) => {
  return await prisma.users.findFirst({
    where: { StudentId: params.StudentId },
  });
};

export default getStudentHasUserQuery;
