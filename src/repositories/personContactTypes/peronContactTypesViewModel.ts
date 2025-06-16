export type ContactTypeViewModel = {
  ContactTypeId: number;
  Name: string;
  IsDeletable?: boolean;
};

export type ContactTypesViewModel = {
  ContactTypeId: number;
  Name: string;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Contacts: {
    ContactId: number;
    PersonId: number;
    ContactTypeId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
  }[];
};
