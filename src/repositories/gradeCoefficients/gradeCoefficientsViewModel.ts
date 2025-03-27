import { Decimal } from "@prisma/client/runtime/library";

export type GradeCoefficientsViewModel = {
  GradeCoefficientId: number;
  Name: string;
  CoefficientNumber: number;
  IsEnabled: boolean;
};

export type GradeCoefficientsMap = {
  GradeCoefficientId: number;
  Name: string;
  Coefficient: Decimal;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  IsEnabled: boolean;
};
