export type LevelsViewModel = {
  LevelId: number;
  Name: string;
  IsEnabled: boolean;
  LevelCourses: {
    LevelCourseId: number;
    CourseId: number;
    CourseName: string;
    CourseCode: string | null;
  }[];
} | null;

export type LevelsTableViewModel = {
  LevelId: number;
  Name: string;
  IsEnabled: boolean;
  LevelCourses: {
    LevelCourseId: number;
    CourseId: number;
    CourseName: string;
    CourseCode: string | null;
  }[];
};

export type LevelCoursesExtendedViewModel = {
  LevelCourseId: number;
  CourseId: number;
  CourseName: string;
  CourseCode: string | null;
};

export type LevelsMap = {
  LevelId: number;
  Name: string;
  IsEnabled: boolean;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  LevelCourses: LevelCoursesMap[];
};

export type LevelCoursesMap = {
  LevelCourseId: number;
  LevelId: number;
  CourseId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Courses: {
    CourseId: number;
    Name: string;
    EnglishName: string;
    CourseCode: string | null;
  };
};
