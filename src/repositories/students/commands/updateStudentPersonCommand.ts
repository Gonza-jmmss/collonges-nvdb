"use server";

import prisma from "@/lib/db";
import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import createPersonCommand from "@/repositories/persons/commands/createPersonCommand";
import updatePersonCommand from "@/repositories/persons/commands/updatePersonCommand";
import createPersonContactCommand from "@/repositories/personContacts/commands/createPersonContactCommand";
import deletePersonContactCommand from "@/repositories/personContacts/commands/deletePersonContactCommand";
import updateStudentCommand from "@/repositories/students/commands/updateStudentCommand";

import { z } from "zod";

type StudentParams = z.infer<typeof StudentPersonSchema>;

const updateStudentPersonCommand = async (params: StudentParams) => {
  // get DB contacts of the student
  const getStudentPreviousContacts = await prisma.contacts.findMany({
    where: { ContactId: params.Person.PersonId || 0 },
  });

  // ids of contacts form form
  const contactPersonIds = params.ContactPerson?.map((x) => x.PersonId);

  // ids of contacts form DB
  const getStudentPreviousContactsIds = getStudentPreviousContacts.map(
    (x) => x.PersonId,
  );

  // filters to get the contacts to create
  const contactsToCreateWithPersonINull =
    params.ContactPerson?.filter((contact) => contact.PersonId === null) || [];
  const contactsToCreateWithPersonIdNotNull =
    params.ContactPerson?.filter(
      (contact) =>
        contact.PersonId !== null &&
        !getStudentPreviousContactsIds?.includes(contact.PersonId),
    ) || [];

  // concatenate both arrays of contact to create
  const contactsToCreate = contactsToCreateWithPersonINull.concat(
    contactsToCreateWithPersonIdNotNull,
  );

  // filter to get the contacts to delete
  const contactsToDelete = getStudentPreviousContacts.filter(
    (contact) => !contactPersonIds?.includes(contact.PersonId),
  );

  // filter to get the contacts to delete
  const contactsToUpdate = params.ContactPerson?.filter(
    (contact) =>
      contact.PersonId !== null &&
      getStudentPreviousContactsIds?.includes(contact.PersonId),
  );

  try {
    const result = await prisma.$transaction(async () => {
      // Update the main person
      const updatePerson = await updatePersonCommand(params.Person);

      // Create new contacts (Mother, Father, etc)
      contactsToCreate.map(async (contact) => {
        // if the contact already exist create de conection else create person and create conection
        if (contact.PersonId) {
          await createPersonContactCommand({
            ContactId: params.Person.PersonId || 0,
            PersonId: contact.PersonId,
            ContactTypeId: contact.ContactTypeId,
          });
        } else {
          const createContact = await createPersonCommand(contact);
          await createPersonContactCommand({
            ContactId: params.Person.PersonId || 0,
            PersonId: createContact.PersonId,
            ContactTypeId: contact.ContactTypeId,
          });
        }
      });

      // Delete existing contacts (Mother, Father, etc)
      contactsToDelete.map(async (contact) => {
        await deletePersonContactCommand(contact);
      });

      // Update contact Person information
      contactsToUpdate?.map(async (contact) => {
        await updatePersonCommand(contact);
      });

      // Update the student
      const studentData = {
        ...params.Student,
        PersonId: params.Person.PersonId || 0,
        DepartmentId: null,
        AccommodationId: null,
      };

      let updateStudent;
      if (studentData.PersonId !== 0)
        updateStudent = await updateStudentCommand(studentData);

      return {
        person: updatePerson,
        student: updateStudent,
      };
    });

    return result;
  } catch (error) {
    console.error("Transaction failed", error);
    throw error; // or handle the error as needed
  }
};

export default updateStudentPersonCommand;
