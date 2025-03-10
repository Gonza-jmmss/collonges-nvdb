export type TeacherCoursesViewModel = {
  UserId: number;
  UserName: string;
  IsEnabled: boolean;
  TeacherCourses: {
    CourseId: number;
    Name: string;
    EnglishName: string;
    CourseCode: string | null;
    CreditAmount: number;
  }[];
};

export type TeacherCoursesExtendedViewModel = {
  CourseId: number;
  Name: string;
  EnglishName: string;
  CourseCode: string;
  CreditAmount: number;
};

export type TeacherCoursesByIdViewModel = {
  UserId: number;
  UserName: string;
  IsEnabled: boolean;
  TeacherCourses: {
    CourseId: number;
    Name: string;
    EnglishName: string;
    CourseCode: string | null;
    CreditAmount: number;
  }[];
} | null;

export type TeacherCoursesMap = {
  UserId: number;
  UserName: string;
  Password: string;
  UpdatedAt?: Date | null;
  CreatedAt: Date;
  RoleId: number;
  IsEnabled: boolean;
  TeacherCourses: {
    TeacherCourseId: number;
    UserId: number;
    CourseId: number;
    UpdatedAt?: Date | null;
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
      UpdatedAt?: Date | null;
      CreatedAt: Date;
    };
  }[];
};

export type CoursesMap = {
  TeacherCourseId: number;
  UserId: number;
  CourseId: number;
  UpdatedAt?: Date | null;
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
    UpdatedAt?: Date | null;
    CreatedAt: Date;
  };
};
