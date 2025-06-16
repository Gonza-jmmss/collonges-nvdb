import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { CollegesViewModel } from "../collegesViewModel";

const prisma = new PrismaClient();

const getAllCollegesQuery = cache(async () => {
  const query = await prisma.colleges.findMany({
    include: { Students: true },
  });

  const res = query.map((college: CollegesViewModel) => ({
    CollegeId: college.CollegeId,
    Name: college.Name,
    Abbreviation: college.Abbreviation,
    IsDeletable: college.Students.length === 0,
  }));

  return res;
});

export default getAllCollegesQuery;
