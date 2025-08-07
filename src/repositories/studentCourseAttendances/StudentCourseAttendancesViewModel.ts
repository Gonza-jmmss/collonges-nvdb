export type StudentCourseAttendancesByCourseIdViewModel = {
  UserId: number;
  AttendanceDate: Date;
  AttendancePeriod: number;
  StudentCourseAttendances: {
    StudentCourseAttendanceId: number;
    StudentCourseId: number;
    AttendanceValue: number;
  }[];
};

export type StudentCourseAttendancesByCourseIdMap = {
  StudentCourseAttendanceId: number;
  StudentCourseId: number;
  UserId: number;
  AttendanceDate: Date;
  AttendanceValue: number;
  AttendancePeriod: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  StudentCourses: {
    StudentCourseId: number;
  };
};

// export type StudentCourseAttendancesByDay = {
//   StudentCourseAttendanceId: number;
//   StudentCourseId: number;
//   CourseId: number;
//   StudentId: number;
//   StudentName: string | null;
//   AttendanceValue: number;
//   AttendanceScore: number | null;
//   CourseName: string;
//   AttendanceDate: Date;
//   UserId: number | null;
//   UserName: string;
// };

export type StudentCourseAttendancesByDay = {
  CourseId: number;
  CourseName: string;
  CourseCode: string | null;
  AttendanceDate: Date;
  AttendancePeriod: number;
  UserId: number | null;
  UserName: string;
};

export type StudentCourseAttendancesByDayViewModel = {
  LevelName: string;
  LevelCourses: { Level: string }[];
  Attendances: StudentCourseAttendancesByDay[];
};

export type StudentCourseAttendancesByDayMap = {
  StudentCourseAttendanceId: number;
  StudentCourseId: number;
  UserId: number;
  AttendanceDate: Date;
  AttendanceValue: number;
  AttendancePeriod: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Users: {
    UserId: number;
    UserName: string;
  };
  StudentCourses: {
    StudentCourseId: number;
    StudentId: number;
    CourseId: number;
    Note: string | null;
    ScholarPeriodId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    AttendanceScore: number | null;
    Courses: {
      Name: string;
      CourseId: number;
      CourseCode: string | null;
      LevelCourses: ({ Levels: { Name: string; LevelId: number } } & {
        UpdatedAt: Date | null;
        CreatedAt: Date;
        CourseId: number;
        LevelId: number;
        LevelCourseId: number;
      })[];
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

export type StudentCourseAttendancesByStudent = {
  CourseId: number;
  CourseName: string;
  CourseCode: string | null;
  AttendanceScore: number | null;
};

export type StudentCourseAttendancesByStudentViewModel = {
  StudentId: number;
  StudentName: string | null;
  Attendances: StudentCourseAttendancesByStudent[];
};

export type StudentCourseAttendancesByStudentMap = {
  StudentCourseAttendanceId: number;
  StudentCourseId: number;
  UserId: number;
  AttendanceDate: Date;
  AttendanceValue: number;
  AttendancePeriod: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  StudentCourses: {
    StudentCourseId: number;
    StudentId: number;
    CourseId: number;
    Note: string | null;
    ScholarPeriodId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    AttendanceScore: number | null;
    Courses: {
      Name: string;
      CourseId: number;
      CourseCode: string | null;
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
      YearPeriodId: number;
      CreditsType: number | null;
      Persons: {
        AlternativeName: string | null;
      };
    };
  };
};

export type StudentCourseAttendancesByAttendancePeriodMap = {
  StudentCourseAttendanceId: number;
  StudentCourseId: number;
  UserId: number;
  AttendanceDate: Date;
  AttendanceValue: number;
  AttendancePeriod: number | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};

export type StudentCourseAttendancesByAttendancePeriodViewModel = {
  StudentCourseAttendanceId: number;
  StudentCourseId: number;
  UserId: number;
  AttendanceDate: Date;
  AttendanceValue: number;
  AttendancePeriod: number | null;
};
