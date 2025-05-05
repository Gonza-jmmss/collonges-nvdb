"use server";

import prisma from "@/lib/db";
import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import createPersonCommand from "@/repositories/persons/commands/createPersonCommand";
import updatePersonCommand from "@/repositories/persons/commands/updatePersonCommand";
import createPersonContactCommand from "@/repositories/personContacts/commands/createPersonContactCommand";
import deletePersonContactCommand from "@/repositories/personContacts/commands/deletePersonContactCommand";
import updateStudentCommand from "@/repositories/students/commands/updateStudentCommand";
import createPersonCountryCommand from "@/repositories/personCountries/commands/createPersonCountryCommand";
import deletePersonCountriesCommand from "@/repositories/personCountries/commands/deletePersonCountriesCommand";

import { z } from "zod";

type StudentParams = z.infer<typeof StudentPersonSchema>;

const updateStudentPersonCommand = async (params: StudentParams) => {
  // contacts
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

  // concatenate both arrays of contacts to create
  const contactsToCreate = contactsToCreateWithPersonINull.concat(
    contactsToCreateWithPersonIdNotNull,
  );

  // filter to get the contacts to delete
  const contactsToDelete = getStudentPreviousContacts.filter(
    (contact) => !contactPersonIds?.includes(contact.PersonId),
  );

  // filter to get the contacts to update
  const contactsToUpdate = params.ContactPerson?.filter(
    (contact) =>
      contact.PersonId !== null &&
      getStudentPreviousContactsIds?.includes(contact.PersonId),
  );

  // personCountries
  // get DB personCountries of the student
  const getStudentPersonCountries = await prisma.personCountries.findMany({
    where: { PersonId: params.Person.PersonId || 0 },
  });

  // ids of countries form form
  const personCountriesIds = params.PersonCountry?.map((x) => x.CountryId);

  // ids of countries form DB
  const getStudentPreviousPersonCountriesIds = getStudentPersonCountries.map(
    (x) => x.CountryId,
  );

  // filters to get the personCountries to create
  const personCountriesToCreate =
    params.PersonCountry?.filter(
      (country) =>
        country.CountryId !== null &&
        !getStudentPreviousPersonCountriesIds?.includes(country.CountryId),
    ) || [];

  // filter to get the personCountries to delete
  const personCountriesToDelete = getStudentPersonCountries
    .filter((country) => !personCountriesIds?.includes(country.CountryId))
    .map((x) => x.PersonCountryId);

  try {
    const result = await prisma.$transaction(async (tx) => {
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
            transactionClient: tx,
          });
        } else {
          const createContact = await createPersonCommand({
            ...contact,
            transactionClient: tx,
          });
          await createPersonContactCommand({
            ContactId: params.Person.PersonId || 0,
            PersonId: createContact.PersonId,
            ContactTypeId: contact.ContactTypeId,
            transactionClient: tx,
          });
        }
      });

      // Delete existing contacts (Mother, Father, etc)
      contactsToDelete.map(async (contact) => {
        await deletePersonContactCommand({ ...contact, transactionClient: tx });
      });

      // Update contact Person information
      contactsToUpdate?.map(async (contact) => {
        await updatePersonCommand({ ...contact, transactionClient: tx });
      });

      // Create new personCountries
      personCountriesToCreate.map(
        async (country) =>
          await createPersonCountryCommand({
            PersonId: params.Person.PersonId || 0,
            CountryId: country.CountryId || 0,
            transactionClient: tx,
          }),
      );

      // Delete existing personCountries
      await deletePersonCountriesCommand({
        personCountryIds: personCountriesToDelete,
        transactionClient: tx,
      });

      // Update the student
      const studentData = {
        ...params.Student,
        PersonId: params.Person.PersonId || 0,
        DepartmentId: null,
        AccommodationId: null,
        transactionClient: tx,
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
