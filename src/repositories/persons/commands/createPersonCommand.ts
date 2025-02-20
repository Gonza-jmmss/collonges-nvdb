"use server";

import { PrismaClient } from "@prisma/client";
import { PersonSchema } from "@/zodSchemas/personsSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type PersonParams = z.infer<typeof PersonSchema>;

const createPersonCommand = async (params: PersonParams) => {
  const command = await prisma.persons.create({
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
      BirthCountryId: params.BirthCountryId,
      Email: params.Email,
      DBaseCode: params.DBaseCode,
      ImageName: params.ImageNameTemp,
    },
  });

  return command;
};

export default createPersonCommand;
