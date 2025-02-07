import { z } from "zod";

export const ContactPerson = z.object({
  PersonId: z.number().nullable(),
  ContactTypeId: z.number(),
  FirstName: z.string().nullable(),
  LastName: z.string().nullable(),
  BirthDate: z.date().nullable(),
  Sex: z.number().nullable(),
  Telephone: z.string().nullable(),
  WorkTelephone: z.string().nullable(),
  BirthCity: z.string().nullable(),
  Address1: z.string().nullable(),
  BirthCountryId: z.number().nullable(),
  Email: z.string().nullable(),
  LoadType: z.number().nullable(),
});

export const StudentPersonSchema = z.object({
  Person: z.object({
    PersonId: z.number().nullable(),
    FirstName: z.string().nullable(),
    LastName: z.string().nullable(),
    BirthDate: z.date().nullable(),
    Sex: z.number().nullable(),
    Telephone: z.string().nullable(),
    WorkTelephone: z.string().nullable(),
    BirthCity: z.string().nullable(),
    Address1: z.string().nullable(),
    BirthCountryId: z.number().nullable(),
    Email: z.string().nullable(),
  }),
  Student: z.object({
    StudentId: z.number().nullable(),
    StudentTypeId: z.number(),
    IsACA: z.boolean(),
    CollegeId: z.number().nullable(),
    RegimeId: z.number().nullable(),
    IsEnabled: z.boolean(),
  }),
  ContactPerson: z.array(ContactPerson).nullable(),
});

export const StudentSchema = z.object({
  StudentId: z.number().nullable(),
  PersonId: z.number(),
  StudentTypeId: z.number(),
  IsACA: z.boolean(),
  DepartmentId: z.number().nullable(),
  CollegeId: z.number().nullable(),
  RegimeId: z.number().nullable(),
  AccommodationId: z.number().nullable(),
  IsEnabled: z.boolean(),
});
