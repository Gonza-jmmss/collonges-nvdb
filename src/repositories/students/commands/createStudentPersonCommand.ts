"use server";

import prisma from "@/lib/db";
import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import createPersonCommand from "@/repositories/persons/commands/createPersonCommand";
import createPersonContactCommand from "@/repositories/personContacts/commands/createPersonContactCommand";
import createStudentCommand from "@/repositories/students/commands/createStudentCommand";

import { z } from "zod";

type StudentParams = z.infer<typeof StudentPersonSchema>;

const createStudentPersonCommand = async (params: StudentParams) => {
  try {
    const result = await prisma.$transaction(async () => {
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
            });
          } else {
            const createContact = await createPersonCommand(contact);
            await createPersonContactCommand({
              ContactId: createPerson.PersonId,
              PersonId: createContact.PersonId,
              ContactTypeId: contact.ContactTypeId,
            });
          }
        });
      }

      // Create the student
      const studentData = {
        ...params.Student,
        PersonId: createPerson.PersonId,
        DepartmentId: null,
        AccommodationId: null,
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
