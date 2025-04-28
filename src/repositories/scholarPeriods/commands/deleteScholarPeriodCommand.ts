"use server";

import { PrismaClient } from "@prisma/client";
import getAllStudentCoursesByScholarPeriodIdQuery from "@/repositories/studentCourses/queries/getAllStudentCoursesByScholarPeriodIdQuery";

const prisma = new PrismaClient();

type DeleteScholarPeriodParams = {
  ScholarPeriodId: number;
};

const deleteScholarPeriodCommand = async (
  params: DeleteScholarPeriodParams,
) => {
  const studentCoursesbyPeriodId =
    await getAllStudentCoursesByScholarPeriodIdQuery(params.ScholarPeriodId);

  if (studentCoursesbyPeriodId.length > 0) {
    throw Error(
      "impossible de supprimer la période car elle a des cours attribués",
    );
  }

  return await prisma.scholarPeriods.delete({
    where: {
      ScholarPeriodId: params.ScholarPeriodId,
    },
  });
};

export default deleteScholarPeriodCommand;
