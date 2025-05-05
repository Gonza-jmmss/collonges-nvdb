"use server";

import prisma from "@/lib/db";
import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import createPersonCommand from "@/repositories/persons/commands/createPersonCommand";
import createPersonContactCommand from "@/repositories/personContacts/commands/createPersonContactCommand";
import createStudentCommand from "@/repositories/students/commands/createStudentCommand";
import createPersonCountryCommand from "@/repositories/personCountries/commands/createPersonCountryCommand";

import { z } from "zod";

type StudentParams = z.infer<typeof StudentPersonSchema>;

const createStudentPersonCommand = async (params: StudentParams) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create the main person
      const createPerson = await createPersonCommand(params.Person);

      // Create the contacts (Mother, Father, etc)
      if (params.ContactPerson !== null) {
        params.ContactPerson.map(async (contact) => {
          // if the contact already exist create de conection else create person and create conection
          if (contact.PersonId) {
            await createPersonContactCommand({
              ContactId: createPerson.PersonId,
              PersonId: contact.PersonId,
              ContactTypeId: contact.ContactTypeId,
              transactionClient: tx, // Pass the transaction client
            });
          } else {
            const createContact = await createPersonCommand(contact);
            await createPersonContactCommand({
              ContactId: createPerson.PersonId,
              PersonId: createContact.PersonId,
              ContactTypeId: contact.ContactTypeId,
              transactionClient: tx, // Pass the transaction client
            });
          }
        });
      }

      // Create personCountries
      if (params.PersonCountry !== null) {
        params.PersonCountry.map(async (country) => {
          await createPersonCountryCommand({
            PersonId: createPerson.PersonId,
            CountryId: country.CountryId || 0,
            transactionClient: tx, // Pass the transaction client
          });
        });
      }

      // Create the student
      const studentData = {
        ...params.Student,
        PersonId: createPerson.PersonId,
        DepartmentId: null,
        AccommodationId: null,
        transactionClient: tx, // Pass the transaction client
      };

      const createStudent = await createStudentCommand(studentData);

      return {
        person: createPerson,
        student: createStudent,
      };
    });

    return result;
  } catch (error) {
    console.error("Transaction failed", error);
    throw error; // or handle the error as needed
  }
};

export default createStudentPersonCommand;
