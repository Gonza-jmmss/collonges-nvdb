import { PrismaClient } from "@prisma/client";
// import { StudentPersonSchema } from "@/zodSchemas/studentsSchema";
import { StudentViewModel } from "../studentsViewModel";
import { z } from "zod";

const prisma = new PrismaClient();

// type StudentData = z.infer<typeof StudentPersonSchema>;

const getStudentProfileDataQuery = async (
  studentId: number,
): Promise<StudentViewModel> => {
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
          CountryId: true,
          Email: true,
          DBaseCode: true,
          ImageName: true,
        },
      },
      StudentTypes: true,
      YearPeriods: true,
      Colleges: true,
      Regimes: true,
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
          CountryId: true,
          Email: true,
        },
      },
    },
  });

  const personCountriesQuery = await prisma.personCountries.findMany({
    where: {
      PersonId: studentQuery.PersonId,
    },
    select: {
      PersonId: true,
      CountryId: true,
    },
  });

  const result: StudentViewModel = {
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
      CountryId: studentQuery.Persons.CountryId,
      Email: studentQuery.Persons.Email,
      DBaseCode: studentQuery.Persons.DBaseCode,
      ImageName: studentQuery.Persons.ImageName,
      ImageNameTemp: null,
    },
    Student: {
      StudentId: studentQuery.StudentId,
      StudentTypeId: studentQuery.StudentTypeId,
      IsACA: studentQuery.IsACA,
      CollegeId: studentQuery.CollegeId,
      CollegeName: studentQuery.Colleges ? studentQuery.Colleges.Name : null,
      RegimeId: studentQuery.RegimeId,
      RegimeName: studentQuery.Regimes ? studentQuery.Regimes?.Name : null,
      IsEnabled: studentQuery.IsEnabled,
      YearPeriodId: studentQuery.YearPeriodId,
      YearPeriodName: studentQuery.YearPeriods.Name,
    },
    ContactPerson: [],
    PersonCountry: personCountriesQuery,
  };

  contactsQuery.forEach((contact) => {
    const contactData = {
      PersonId: contact.Persons_Contacts_PersonIdToPersons.PersonId,
      FirstName: contact.Persons_Contacts_PersonIdToPersons.FirstName,
      LastName: contact.Persons_Contacts_PersonIdToPersons.LastName,
      BirthDate: null,
      Sex: null,
      ContactTypeId: contact.ContactTypeId,
      Telephone: contact.Persons_Contacts_PersonIdToPersons.Telephone,
      WorkTelephone: contact.Persons_Contacts_PersonIdToPersons.WorkTelephone,
      BirthCity: contact.Persons_Contacts_PersonIdToPersons.BirthCity,
      Address1: contact.Persons_Contacts_PersonIdToPersons.Address1,
      BirthCountryId: null,
      CountryId: contact.Persons_Contacts_PersonIdToPersons.CountryId,
      Email: contact.Persons_Contacts_PersonIdToPersons.Email,
      DBaseCode: null,
      ImageName: null,
      ImageNameTemp: null,
      LoadType: null,
    };
    result.ContactPerson?.push(contactData);
  });

  return result;
};

export default getStudentProfileDataQuery;
