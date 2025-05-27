"use server";

import { PrismaClient } from "@prisma/client";
import getAllStudentsByCollegeIdQuery from "@/repositories/students/queries/getAllStudentsByCollegeIdQuery";

const prisma = new PrismaClient();

type DeleteCollegeParams = {
  CollegeId: number;
};

const deleteCollegeCommand = async (params: DeleteCollegeParams) => {
  const studentCoursesbyPeriodId = await getAllStudentsByCollegeIdQuery({
    CollegeId: params.CollegeId,
  });

  if (studentCoursesbyPeriodId.length > 0) {
    throw Error(
      "impossible de supprimer l'université car elle a des étudiants attribués",
    );
  }

  const deletePersonCountry = prisma.colleges.delete({
    where: {
      CollegeId: params.CollegeId,
    },
  });

  return deletePersonCountry;
};

export default deleteCollegeCommand;
