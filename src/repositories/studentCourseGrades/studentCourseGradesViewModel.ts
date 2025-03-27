import { Decimal } from "@prisma/client/runtime/library";

export type StudentCourseGradesByCourseIdViewModel = {
  GradeCoefficientId: number;
  UserId: number;
  Description: string;
  StudentCourses: {
    StudentCourseGradeId: number;
    StudentCourseId: number;
    Grade: string;
    CreatedAt: Date;
  }[];
};

export type StudentCourseGradesByCourseIdMap = {
  StudenCourseGradeId: number;
  StudentCourseId: number;
  Grade: string;
  GradeCoefficientId: number;
  UserId: number;
  Description: string;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  StudentCourses: {
    StudentCourseId: number;
    Note: string | null;
  };
};

export type StudentCourseGradesByStudentCourseViewModel = {
  StudentCourseId: number;
  CourseId: number;
  CourseName: string;
  CourseCode: string | null;
  StudentId: number;
  StudentName: string | null;
  Grade: string | null;
  LevelName: string;
  LevelCourses: {
    Level: string;
  }[];
  StudentCourseGrades: {
    StudentCourseGradeId: number;
    Description: string;
    GradeCoefficientName: string;
    Grade: string;
    CreatedAt: Date;
    UserId: number;
    UserName: string;
  }[];
};

export type StudentCourseGradesExtendedViewModel = {
  Description: string;
  GradeCoefficientName: string;
  Grade: string;
  CreatedAt: Date;
};

export type StudentCourseByStudentCourseMap = {
  StudentCourseId: number;
  StudentId: number;
  CourseId: number;
  Note: string | null;
  ScholarPeriodId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Courses: {
    CourseId: number;
    Name: string;
    EnglishName: string;
    CourseCode: string | null;
    CreditAmount: number;
    CoursePeriodId: number;
    PeriodNumber: number | null;
    CourseTypeId: number;
    IsEnabled: boolean | null;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    LevelCourses: {
      LevelCourseId: number;
      LevelId: number;
      CourseId: number;
      UpdatedAt: Date | null;
      CreatedAt: Date;
      Levels: {
        LevelId: number;
        Name: string;
        IsEnabled: boolean;
        UpdatedAt: Date | null;
        CreatedAt: Date;
      };
    }[];
  };
  Students: {
    StudentId: number;
    PersonId: number;
    StudentTypeId: number;
    IsACA: boolean;
    DepartmentId: number | null;
    CollegeId: number | null;
    RegimeId: number | null;
    AccommodationId: number | null;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    IsEnabled: boolean;
    Persons: {
      AlternativeName: string | null;
    };
  };
  StudentCourseGrades: {
    StudenCourseGradeId: number;
    StudentCourseId: number;
    Grade: string;
    GradeCoefficientId: number;
    UserId: number;
    Description: string;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    GradeCoefficients: {
      GradeCoefficientId: number;
      Name: string;
      Coefficient: Decimal;
      UpdatedAt: Date | null;
      CreatedAt: Date;
      IsEnabled: boolean;
    };
    Users: {
      UserId: number;
      UserName: string;
      Password: string;
      UpdatedAt: Date | null;
      CreatedAt: Date;
      RoleId: number;
      IsEnabled: boolean;
    };
  }[];
  ScholarPeriods: {
    ScholarPeriodId: number;
    Name: string;
    Number: number;
    FromDate: Date | null;
    ToDate: Date | null;
    IsActive: boolean;
    ScholarYearId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    ScholarYears: {
      ScholarYearId: number;
      Name: string;
      FromDate: Date | null;
      ToDate: Date | null;
      UpdatedAt: Date | null;
      CreatedAt: Date;
      IsActive: boolean;
    };
  };
};

export type LevelCoursesMap = {
  LevelCourseId: number;
  LevelId: number;
  CourseId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Levels: {
    LevelId: number;
    Name: string;
    IsEnabled: boolean;
    UpdatedAt: Date | null;
    CreatedAt: Date;
  };
};

export type StudentCourseGradesByStudentCourseMap = {
  StudenCourseGradeId: number;
  StudentCourseId: number;
  Grade: string;
  GradeCoefficientId: number;
  UserId: number;
  Description: string;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  GradeCoefficients: {
    GradeCoefficientId: number;
    Name: string;
    Coefficient: Decimal;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    IsEnabled: boolean;
  };
  Users: {
    UserId: number;
    UserName: string;
    Password: string;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    RoleId: number;
    IsEnabled: boolean;
  };
};

export type GradeCoefficientsByStudentCourseIdMap = {
  GradeCoefficientId: number;
  Name: string;
  Coefficient: Decimal;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  IsEnabled: boolean;
  StudentCourseGrades: {
    StudenCourseGradeId: number;
    StudentCourseId: number;
    Grade: string;
    GradeCoefficientId: number;
    UserId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    Description: string;
  }[];
};

export type StudentCourseGradesByStudentCourseIdMap = {
  StudenCourseGradeId: number;
  StudentCourseId: number;
  Grade: string;
  GradeCoefficientId: number;
  UserId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Description: string;
};

export type StudentCourseGradeByActivity = {
  StudentCourseGradeId: number;
  StudentCourseId: number;
  StudentId: number;
  StudentName: string | null;
  Grade: string;
  AverageGrade: string | null;
};

export type StudentCourseGradeByActivityViewModel = {
  Description: string | null;
  CreatedAt: Date;
  UserId: number | null;
  UserName: string;
  Coefficient: number;
  GradeCoefficientId: number;
  GradeCoefficientName: string;
  LevelName: string;
  LevelCourses: { Level: string }[];
  Activities: StudentCourseGradeByActivity[];
};

export type StudentCourseGradesByGradeCoefficientMap = {
  StudenCourseGradeId: number;
  StudentCourseId: number;
  Grade: string;
  GradeCoefficientId: number;
  UserId: number;
  Description: string;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  GradeCoefficients: {
    GradeCoefficientId: number;
    Name: string;
    Coefficient: Decimal;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    IsEnabled: boolean;
  };
  Users: {
    UserId: number;
    UserName: string;
    Password: string;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    RoleId: number;
    IsEnabled: boolean;
  };
  StudentCourses: {
    StudentCourseId: number;
    StudentId: number;
    CourseId: number;
    Note: string | null;
    ScholarPeriodId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    Courses: {
      CourseId: number;
      Name: string;
      EnglishName: string;
      CourseCode: string | null;
      CreditAmount: number;
      CoursePeriodId: number;
      PeriodNumber: number | null;
      CourseTypeId: number;
      IsEnabled: boolean | null;
      UpdatedAt: Date | null;
      CreatedAt: Date;
      LevelCourses: {
        LevelCourseId: number;
        LevelId: number;
        CourseId: number;
        UpdatedAt: Date | null;
        CreatedAt: Date;
        Levels: {
          LevelId: number;
          Name: string;
          IsEnabled: boolean;
          UpdatedAt: Date | null;
          CreatedAt: Date;
        };
      }[];
    };
    Students: {
      StudentId: number;
      PersonId: number;
      StudentTypeId: number;
      IsACA: boolean;
      DepartmentId: number | null;
      CollegeId: number | null;
      RegimeId: number | null;
      AccommodationId: number | null;
      UpdatedAt: Date | null;
      CreatedAt: Date;
      IsEnabled: boolean;
      Persons: {
        AlternativeName: string | null;
      };
    };
    ScholarPeriods: {
      ScholarPeriodId: number;
      Name: string;
      Number: number;
      FromDate: Date | null;
      ToDate: Date | null;
      IsActive: boolean;
      ScholarYearId: number;
      UpdatedAt: Date | null;
      CreatedAt: Date;
      ScholarYears: {
        ScholarYearId: number;
        Name: string;
        FromDate: Date | null;
        ToDate: Date | null;
        UpdatedAt: Date | null;
        CreatedAt: Date;
        IsActive: boolean;
      };
    };
  };
};
