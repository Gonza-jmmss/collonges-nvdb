export type CourseTextbookViewModel = {
  CourseContentId: number;
  CourseId: number;
  CourseCode: string | null;
  CourseName: string;
  UserId: number;
  ContentDate: Date;
  Content: string;
  ReferenceDate: Date;
  Homeworks: {
    CourseHomeworkId: number;
    CourseId: number;
    UserId: number;
    HomeworkDate: Date;
    HomeworkDueDate: Date;
    Description: string;
    ReferenceDate: Date;
  }[];
};

export type CourseContentsViewModel = {
  CourseContentId: number;
  CourseId: number;
  CourseName: string;
  CourseCode: string | null;
  LevelId: number;
  LevelName: string;
  UserId: number;
  UserName: string;
  ContentDate: Date;
  Content: string;
  ReferenceDate: Date;
};

export type CourseContentsMap = {
  CourseContentId: number;
  CourseId: number;
  UserId: number;
  ContentDate: Date;
  Content: string;
  ReferenceDate: Date;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Users: {
    UserId: number;
    UserName: string;
  };
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
export type CourseHomeworksByCourseIdAndTextbookDateMap = {
  CourseId: number;
  UserId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  CourseHomeworkId: number;
  HomeworkDate: Date;
  HomeworkDueDate: Date;
  Description: string;
  ReferenceDate: Date;
  Courses: {
    CourseId: number;
    Name: string;
    CourseCode: string | null;
  };
};

export type CourseHomeworksByCourseIdAndTextBookDateMap = {
  CourseHomeworkId: number;
  CourseId: number;
  UserId: number;
  HomeworkDate: Date;
  HomeworkDueDate: Date;
  Description: string;
  ReferenceDate: Date;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};
