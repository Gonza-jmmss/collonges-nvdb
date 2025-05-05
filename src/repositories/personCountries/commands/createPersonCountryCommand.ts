"use server";

import { PrismaClient } from "@prisma/client";
import { PersonCountrySchema } from "@/zodSchemas/personCountry";
import { z } from "zod";

const prisma = new PrismaClient();

type PersonCountryParams = z.infer<typeof PersonCountrySchema> & {
  transactionClient?: any;
};

const createPersonCountryCommand = async (params: PersonCountryParams) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  const command = await client.personCountries.create({
    data: {
      PersonId: params.PersonId,
      CountryId: params.CountryId,
    },
  });

  return command;
};

export default createPersonCountryCommand;
