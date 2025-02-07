export type StudentsViewModel = {
  StudentId: number;
  PersonId: number;
  StudentTypeId: number;
  IsACA: boolean;
  DepartmentId?: number | null;
  CollegeId?: number | null;
  RegimeId?: number | null;
  AccommodationId?: number | null;
  UpdatedAt?: Date | null;
  CreatedAt: Date;
  StudentName?: string | null;
  StudentType?: string | null;
  DBaseCode?: string | null;
  IsEnabled: boolean;
};

export type StudentsMapViewModel = {
  StudentId: number;
  PersonId: number;
  StudentTypeId: number;
  IsACA: boolean;
  DepartmentId: number | null;
  CollegeId: number | null;
  RegimeId: number | null;
  AccommodationId: number | null;
  IsEnabled: boolean;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Persons?: {
    AlternativeName: string | null;
    DBaseCode: string | null;
  } | null;
  StudentTypes?: {
    Name: string | null;
  } | null;
};

export type StudentViewModel = {
  Person: {
    FirstName: string | null;
    LastName: string | null;
    BirthDate: Date | null;
    Sex: number | null;
    Telephone: string | null;
    WorkTelephone: string | null;
    BirthCity: string | null;
    Address1: string | null;
    BirthCountryId: number | null;
    Email: string | null;
  };
  MotherPerson?: {
    FirstName: string | null;
    LastName: string | null;
    BirthDate: Date | null;
    Sex: number | null;
    Telephone: string | null;
    WorkTelephone: string | null;
    BirthCity: string | null;
    Address1: string | null;
    BirthCountryId: number | null;
    Email: string | null;
  } | null;
  FatherPerson?: {
    FirstName: string | null;
    LastName: string | null;
    BirthDate: Date | null;
    Sex: number | null;
    Telephone: string | null;
    WorkTelephone: string | null;
    BirthCity: string | null;
    Address1: string | null;
    BirthCountryId: number | null;
    Email: string | null;
  } | null;
  Student: {
    StudentTypeId: number;
    IsACA: boolean;
    CollegeId: number | null;
    RegimeId: number | null;
    IsEnabled: boolean;
  };
};
