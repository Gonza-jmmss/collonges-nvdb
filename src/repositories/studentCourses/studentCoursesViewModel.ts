export type StudentCoursesViewModel = {
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
  }[];
};

export type StudentCoursesExtendedViewModel = {
  StudentCourseId: number;
  Note: string | null;
  ScholarPeriodId: number;
  CourseId: number;
  Name: string;
  CourseCode: string | null;
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
  Persons: {
    AlternativeName: string | null;
  };
  StudentCourses: StudentCourseGroupedByStudentMap[];
};

export type StudentCourseGroupedByStudentMap = {
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
  }[];
} | null;
