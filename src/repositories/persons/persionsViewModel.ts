export type PersonViewModel = {
  PersonId: number;
  FirstName: string | null;
  LastName: string | null;
  AlternativeName: string | null;
  BirthDate: Date | null;
  Sex: number | null;
  Telephone: string | null;
  WorkTelephone: string | null;
  CivilStatus: number | null;
  ReligionId: number | null;
  Profession: string | null;
  BirthCity: string | null;
  Address1: string | null;
  Address2: string | null;
  Address3: string | null;
  CountryId: number | null;
  BirthCountryId: number | null;
  Email: string | null;
  DBaseCode: string | null;
};

export type PersonsViewModel = {
  PersonId: number;
  FirstName: string | null;
  LastName: string | null;
  AlternativeName: string | null;
  BirthDate: Date | null;
  Sex: number | null;
  Telephone: string | null;
  WorkTelephone: string | null;
  CivilStatus: number | null;
  ReligionId: number | null;
  Profession: string | null;
  BirthCity: string | null;
  Address1: string | null;
  Address2: string | null;
  Address3: string | null;
  CountryId: number | null;
  BirthCountryId: number | null;
  Email: string | null;
  DBaseCode: string | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};

export type NonStudentsViewModel = {
  PersonId: number;
  AlternativeName: string | null;
  Email: string | null;
};
