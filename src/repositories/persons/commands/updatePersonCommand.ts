"use server";

import { PrismaClient } from "@prisma/client";
import { PersonSchema } from "@/zodSchemas/personsSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type PersonParams = z.infer<typeof PersonSchema>;

const updatePersonCommand = async (params: PersonParams) => {
  if (params.PersonId !== null) {
    const command = await prisma.persons.update({
      where: { PersonId: params.PersonId },
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
        CountryId: params.CountryId,
        Email: params.Email,
        DBaseCode: params.DBaseCode,
        ImageName:
          params.ImageNameTemp !== null
            ? params.ImageNameTemp
            : params.ImageName,
      },
    });

    return command;
  } else return null;
};

export default updatePersonCommand;
