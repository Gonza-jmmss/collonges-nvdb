"use server";

import { PrismaClient } from "@prisma/client";
import { PersonSchema } from "@/zodSchemas/personsSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type PersonParams = z.infer<typeof PersonSchema> & {
  transactionClient?: any;
};

const createPersonCommand = async (params: PersonParams) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  const command = await client.persons.create({
    data: {
      FirstName: params.FirstName,
      LastName: params.LastName?.toUpperCase(),
      AlternativeName: `${params.LastName?.toUpperCase()} ${params.FirstName}`,
      BirthDate: params.BirthDate,
      Sex: params.Sex,
      Telephone: params.Telephone,
      WorkTelephone: params.WorkTelephone,
      BirthCity: params.BirthCity,
      Address1: params.Address1,
      CountryId: params.CountryId,
      BirthCountryId: params.BirthCountryId,
      Email: params.Email,
      DBaseCode: params.DBaseCode,
      ImageName: params.ImageNameTemp,
    },
  });

  return command;
};

export default createPersonCommand;
