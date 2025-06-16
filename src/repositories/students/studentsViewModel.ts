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
  YearPeriodId: number;
  YearPeriodName: string;
  HasUser: boolean;
  FirstCredentials: {
    UserName: string | null;
    StudentId: number;
    UserFirstName: string | null | undefined;
  };
};

export type StudentViewModel = {
  Person: {
    PersonId: number | null;
    FirstName: string | null;
    LastName: string | null;
    BirthDate: Date | null;
    Sex: number | null;
    Telephone: string | null;
    WorkTelephone: string | null;
    BirthCity: string | null;
    Address1: string | null;
    BirthCountryId: number | null;
    CountryId: number | null;
    Email: string | null;
    DBaseCode: string | null;
    ImageName: string | null;
    ImageNameTemp: string | null;
  };
  Student: {
    StudentId: number | null;
    StudentTypeId: number;
    IsACA: boolean;
    CollegeId: number | null;
    CollegeName: string | null;
    RegimeId: number | null;
    RegimeName: string | null;
    IsEnabled: boolean;
    YearPeriodId: number | null;
    YearPeriodName: string | null;
  };
  ContactPerson:
    | {
        PersonId: number | null;
        FirstName: string | null;
        LastName: string | null;
        BirthDate: Date | null;
        Sex: number | null;
        ContactTypeId: number;
        Telephone: string | null;
        WorkTelephone: string | null;
        BirthCity: string | null;
        Address1: string | null;
        BirthCountryId: number | null;
        CountryId: number | null;
        Email: string | null;
        DBaseCode: string | null;
        ImageName: string | null;
        ImageNameTemp: string | null;
        LoadType: number | null;
      }[]
    | null;
  PersonCountry: { CountryId: number | null }[] | null;
};

export type StudentsMap = {
  StudentId: number;
  PersonId: number;
  StudentTypeId: number;
  IsACA: boolean;
  DepartmentId: number | null;
  CollegeId: number | null;
  RegimeId: number | null;
  AccommodationId: number | null;
  IsEnabled: boolean;
  YearPeriodId: number;
  CreditsType?: number | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Persons?: {
    PersonId: number;
    FirstName: string | null;
    AlternativeName: string | null;
    DBaseCode: string | null;
  } | null;
  StudentTypes?: {
    StudentTypeId: number;
    Name: string | null;
  } | null;
  YearPeriods: {
    YearPeriodId: number;
    Name: string;
  };
  Users?: {
    UserId: number;
    UserName: string;
    Password: string;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    RoleId: number;
    IsEnabled: boolean;
    StudentId: number | null;
  }[];
};

export type StudentsByCollegeMap = {
  StudentId: number;
  PersonId: number;
  StudentTypeId: number;
  IsACA: boolean;
  DepartmentId: number | null;
  CollegeId: number | null;
  RegimeId: number | null;
  AccommodationId: number | null;
  IsEnabled: boolean;
  YearPeriodId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};

export type FirstCredentialsViewModel = {
  UserName: string | null;
  StudentId: number;
  UserFirstName: string | null | undefined;
};
