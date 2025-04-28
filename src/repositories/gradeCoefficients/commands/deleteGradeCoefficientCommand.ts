"use server";

import { PrismaClient } from "@prisma/client";
// import getAllStudentCoursesByGradeCoefficientIdQuery from "@/repositories/studentCourses/queries/getAllStudentCoursesByGradeCoefficientIdQuery";

const prisma = new PrismaClient();

type DeleteGradeCoefficientParams = {
  GradeCoefficientId: number;
};

const deleteGradeCoefficientCommand = async (
  params: DeleteGradeCoefficientParams,
) => {
  //   const studentCoursesbyPeriodId =
  //     await getAllStudentCoursesByGradeCoefficientIdQuery(params.GradeCoefficientId);

  //   if (studentCoursesbyPeriodId.length > 0) {
  //     throw Error(
  //       "impossible de supprimer la période car elle a des cours attribués",
  //     );
  //   }

  return await prisma.gradeCoefficients.delete({
    where: {
      GradeCoefficientId: params.GradeCoefficientId,
    },
  });
};

export default deleteGradeCoefficientCommand;
