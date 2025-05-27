import { PrismaClient } from "@prisma/client";
import { StudentsByCollegeMap } from "../studentsViewModel";

const prisma = new PrismaClient();

type getAllStudentsByCollegeIdQueryParams = {
  CollegeId: number;
};

const getAllStudentsByCollegeIdQuery = async (
  params: getAllStudentsByCollegeIdQueryParams,
) => {
  const query = await prisma.students.findMany({
    where: {
      CollegeId: params.CollegeId,
    },
  });

  const res = query.map((student: StudentsByCollegeMap) => ({
    ...student,
  }));

  return res;
};

export default getAllStudentsByCollegeIdQuery;
