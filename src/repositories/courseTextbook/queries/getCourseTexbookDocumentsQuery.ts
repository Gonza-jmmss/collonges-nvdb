"use server";

import { PrismaClient } from "@prisma/client";
import { courseHomeworksDocumentsMap } from "../courseTextbookViewModel";

const prisma = new PrismaClient();

type getCourseTexbookDocumentsQueryParams = {
  CourseId: number;
  ReferenceDate: Date;
};

const getCourseTexbookDocumentsQuery = async (
  params: getCourseTexbookDocumentsQueryParams,
) => {
  // Normalize ReferenceDate to get full day range
  const referenceDateStart = new Date(params.ReferenceDate);
  referenceDateStart.setMilliseconds(0); // Set milliseconds to 0
  // referenceDateStart.setSeconds(referenceDateStart.getSeconds() - 1); // Previous second to create a range

  const referenceDateEnd = new Date(referenceDateStart);
  referenceDateEnd.setSeconds(referenceDateEnd.getSeconds() + 1); // Next second to create a range

  const courseContentsQuery = await prisma.courseContents.findFirstOrThrow({
    where: {
      CourseId: params.CourseId,
      ReferenceDate: {
        gte: referenceDateStart,
        lte: referenceDateEnd,
      },
    },
    orderBy: [{ Courses: { Name: "asc" } }],
  });

  const courseHomeworksQuery = await prisma.courseHomeworks.findMany({
    where: {
      CourseId: params.CourseId,
      ReferenceDate: {
        gte: referenceDateStart,
        lte: referenceDateEnd,
      },
    },
    orderBy: [{ Courses: { Name: "asc" } }],
  });

  // Collect all documents using functional approach

  const documents: string[] = [
    // Add courseContents documents if they exist
    ...(courseContentsQuery.Documents
      ? courseContentsQuery.Documents.split(",").map((doc) => doc.trim())
      : []),
    // Add courseHomeworks documents, filtering out null/undefined values and splitting comma-separated values
    ...courseHomeworksQuery
      .filter((homework: courseHomeworksDocumentsMap) => homework.Documents)
      .flatMap(
        (homework: courseHomeworksDocumentsMap) =>
          (homework.Documents &&
            homework.Documents.split(",").map((doc) => doc.trim())) ||
          [],
      ),
  ];

  const result = {
    Documents: documents,
  };

  return result;
};

export default getCourseTexbookDocumentsQuery;
