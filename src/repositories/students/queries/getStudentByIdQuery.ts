import { PrismaClient } from "@prisma/client";
import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentData = z.infer<typeof StudentPersonSchema>;

const getStudentByIdQuery = async (studentId: number): Promise<StudentData> => {
  const studentQuery = await prisma.students.findFirstOrThrow({
    where: {
      StudentId: studentId,
    },
    include: {
      Persons: {
        select: {
          PersonId: true,
          FirstName: true,
          LastName: true,
          BirthDate: true,
          Sex: true,
          Telephone: true,
          WorkTelephone: true,
          BirthCity: true,
          Address1: true,
          BirthCountryId: true,
          Email: true,
        },
      },
      StudentTypes: {
        select: {
          Name: true,
        },
      },
    },
  });

  const contactsQuery = await prisma.contacts.findMany({
    where: {
      ContactId: studentQuery.PersonId,
    },
    include: {
      Persons_Contacts_PersonIdToPersons: {
        select: {
          PersonId: true,
          FirstName: true,
          LastName: true,
          BirthDate: true,
          Sex: true,
          Telephone: true,
          WorkTelephone: true,
          BirthCity: true,
          Address1: true,
          BirthCountryId: true,
          Email: true,
        },
      },
    },
  });

  const result: StudentData = {
    Person: {
      PersonId: studentQuery.Persons.PersonId,
      FirstName: studentQuery.Persons.FirstName,
      LastName: studentQuery.Persons.LastName,
      BirthDate: studentQuery.Persons.BirthDate,
      Sex: studentQuery.Persons.Sex,
      Telephone: studentQuery.Persons.Telephone,
      WorkTelephone: studentQuery.Persons.WorkTelephone,
      BirthCity: studentQuery.Persons.BirthCity,
      Address1: studentQuery.Persons.Address1,
      BirthCountryId: studentQuery.Persons.BirthCountryId,
      Email: studentQuery.Persons.Email,
    },
    Student: {
      StudentId: studentQuery.StudentId,
      StudentTypeId: studentQuery.StudentTypeId,
      IsACA: studentQuery.IsACA,
      CollegeId: studentQuery.CollegeId,
      RegimeId: studentQuery.RegimeId,
      IsEnabled: studentQuery.IsEnabled,
    },
    ContactPerson: [],
  };

  contactsQuery.forEach((contact) => {
    const contactData = {
      PersonId: contact.Persons_Contacts_PersonIdToPersons.PersonId,
      FirstName: contact.Persons_Contacts_PersonIdToPersons.FirstName,
      LastName: contact.Persons_Contacts_PersonIdToPersons.LastName,
      ContactTypeId: contact.ContactTypeId,
      BirthDate: contact.Persons_Contacts_PersonIdToPersons.BirthDate,
      Sex: contact.Persons_Contacts_PersonIdToPersons.Sex,
      Telephone: contact.Persons_Contacts_PersonIdToPersons.Telephone,
      WorkTelephone: contact.Persons_Contacts_PersonIdToPersons.WorkTelephone,
      BirthCity: contact.Persons_Contacts_PersonIdToPersons.BirthCity,
      Address1: contact.Persons_Contacts_PersonIdToPersons.Address1,
      BirthCountryId: contact.Persons_Contacts_PersonIdToPersons.BirthCountryId,
      Email: contact.Persons_Contacts_PersonIdToPersons.Email,
      LoadType: null,
    };
    result.ContactPerson?.push(contactData);
  });

  return result;
};

export default getStudentByIdQuery;
