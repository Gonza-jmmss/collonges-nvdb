import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { RegimesViewModel } from "../regimesViewModel";

const prisma = new PrismaClient();

const getAllRegimesQuery = cache(async () => {
  const query = await prisma.regimes.findMany({});

  const res = query.map((regime: RegimesViewModel) => ({
    RegimeId: regime.RegimeId,
    Name: regime.Name,
    Abbreviation: regime.Abbreviation,
  }));

  return res;
});

export default getAllRegimesQuery;
