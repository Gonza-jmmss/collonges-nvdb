export type StudentCoursesViewModel = {
  StudentId: number;
  AlternativeName: string | null;
  IsEnabled: boolean;
  StudentCourses: {
    StudentCourseId: number;
    Note: string | null;
    ScholarPeriodId: number;
    ScholarPeriodName: string;
    CourseId: number;
    Name: string;
    CourseCode: string | null;
    AttendanceScore: number | null;
  }[];
};

export type StudentCoursesExtendedViewModel = {
  StudentCourseId: number;
  Note: string | null;
  ScholarPeriodId: number;
  CourseId: number;
  Name: string;
  CourseCode: string | null;
  AttendanceScore: number | null;
};

export type StudentCoursesGroupedByStudentMap = {
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
  YearPeriodId: number;
  Persons: {
    AlternativeName: string | null;
  };
  StudentCourses: AllStudentCoursesMap[];
};

export type AllStudentCoursesMap = {
  StudentCourseId: number;
  StudentId: number;
  CourseId: number;
  Note: string | null;
  ScholarPeriodId: number;
  AttendanceScore: number | null;
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
  ScholarPeriods: {
    Name: string;
  };
};

export type StudentCoursesGroupedByStudentIdMap = {
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
  YearPeriodId: number;
  Persons: {
    AlternativeName: string | null;
  };
  StudentCourses: StudentCoursesByStudentIdMap[];
};

export type StudentCoursesByStudentIdMap = {
  StudentCourseId: number;
  StudentId: number;
  CourseId: number;
  Note: string | null;
  ScholarPeriodId: number;
  AttendanceScore: number | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Courses: {
    CourseId: number;
    Name: string;
    EnglishName: string;
    CourseCode: string | null;
  };
  ScholarPeriods: {
    Name: string;
  };
};

export type StudentsWithNoCoursesMap = {
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
  YearPeriodId: number;
  Persons: {
    AlternativeName: string | null;
  };
};

export type StudentsWithNoCoursesViewModel = {
  StudentId: number;
  AlternativeName: string | null;
};

export type StudentCoursesByStudentIdViewModel = {
  StudentId: number;
  AlternativeName: string | null;
  StudentCourses: {
    StudentCourseId: number;
    Note: string | null;
    ScholarPeriodId: number;
    ScholarPeriodName: string;
    CourseId: number;
    Name: string;
    CourseCode: string | null;
    AttendanceScore: number | null;
  }[];
} | null;

export type StudentCoursesByScholarPeriodIdMap = {
  StudentId: number;
  ScholarPeriodId: number;
  CourseId: number;
  Note: string | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  StudentCourseId: number;
  AttendanceScore: number | null;
};

export type StudentsByCourseIdMap = {
  StudentCourseId: number;
  StudentId: number;
  CourseId: number;
  Note: string | null;
  ScholarPeriodId: number;
  AttendanceScore: number | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
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
    YearPeriodId: number;
    Persons: {
      AlternativeName: string | null;
    };
  };
};

export type StudentsByCourseIdViewModel = {
  StudentCourseId: number;
  StudentId: number;
  CourseId: number;
  Note: string | null;
  ScholarPeriodId: number;
  StudentName: string | null;
  AttendanceScore: number | null;
};
