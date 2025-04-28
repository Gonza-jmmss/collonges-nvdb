export type CountryViewModel = {
  CountryId: number;
  Name: string;
  ISO2: string | null;
  ISO3: string | null;
  PhoneCode: string | null;
  NameEnglish: string | null;
};

export type CountriesViewModel = {
  CountryId: number;
  Name: string;
  ISO2: string | null;
  ISO3: string | null;
  PhoneCode: string | null;
  NameEnglish: string | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};
