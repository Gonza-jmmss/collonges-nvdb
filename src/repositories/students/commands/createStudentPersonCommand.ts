"use server";

import prisma from "@/lib/db";
import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import createPersonCommand from "@/repositories/persons/commands/createPersonCommand";
import createPersonContactCommand from "@/repositories/personContacts/commands/createPersonContactCommand";
import createStudentCommand from "@/repositories/students/commands/createStudentCommand";
import createPersonCountryCommand from "@/repositories/personCountries/commands/createPersonCountryCommand";
import createUserCommand from "@/repositories/users/commands/createUserCommand";
import getAllRolesQuery from "@/repositories/roles/queries/getAllRolesQuery";

import { z } from "zod";

type StudentParams = z.infer<typeof StudentPersonSchema>;

const createStudentPersonCommand = async (params: StudentParams) => {
  const roles = await getAllRolesQuery({ IsEnabled: true });
  const studentRole = roles.find((x) => x.Name === "Étudiant");

  if (studentRole === undefined) {
    throw Error(
      "Le rôle Étudiant n'existe pas, créez le rôle « Étudiant » et réessayez",
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const personData = {
        ...params.Person,
        transactionClient: tx, // Pass the transaction client
      };
      // Create the main person
      const createPerson = await createPersonCommand(personData);

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

      // Create a user for the student
      if (studentRole !== undefined) {
        const studentUser = {
          UserName: `${params.Person.FirstName?.split(" ")[0]}.${params.Person.LastName?.split(" ")[0]}`,
          Password: `${params.Person.FirstName?.split(" ")[0]}.${createStudent.StudentId}`,
          RoleId: studentRole.RoleId,
          IsEnabled: true,
          StudentId: createStudent.StudentId,
          transactionClient: tx, // Pass the transaction client
        };
        await createUserCommand(studentUser);
      }

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
