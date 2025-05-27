import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type getCollegeByIdQueryParams = {
  CollegeId: number;
};

const getCollegeByIdQuery = async (params: getCollegeByIdQueryParams) => {
  const query = await prisma.colleges.findFirstOrThrow({
    where: { CollegeId: params.CollegeId },
  });

  const res = {
    CollegeId: query.CollegeId,
    Name: query.Name,
    Abbreviation: query.Abbreviation,
  };

  return res;
};

export default getCollegeByIdQuery;
