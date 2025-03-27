import { PrismaClient } from "@prisma/client";
import {
  StudentCourseByStudentCourseMap,
  LevelCoursesMap,
  StudentCourseGradesByStudentCourseMap,
} from "../studentCourseGradesViewModel";

const prisma = new PrismaClient();

type getStudentCourseGradesByStudentCourseQueryParamsType = {
  CourseId: number;
};

const getStudentCourseGradesByStudentCourseQuery = async (
  params: getStudentCourseGradesByStudentCourseQueryParamsType,
) => {
  const query = await prisma.studentCourses.findMany({
    where: {
      CourseId: params.CourseId,
    },
    include: {
      Courses: {
        include: {
          LevelCourses: {
            include: {
              Levels: true,
            },
          },
        },
      },
      Students: {
        include: {
          Persons: {
            select: {
              AlternativeName: true,
            },
          },
        },
      },
      StudentCourseGrades: {
        orderBy: { CreatedAt: "desc" },
        include: {
          GradeCoefficients: true,
          Users: true,
        },
      },
      ScholarPeriods: {
        include: {
          ScholarYears: true,
        },
      },
    },
  });

  const res = query.map((studentCourse: StudentCourseByStudentCourseMap) => ({
    StudentCourseId: studentCourse.StudentCourseId,
    CourseId: studentCourse.CourseId,
    CourseName: studentCourse.Courses.Name,
    CourseCode: studentCourse.Courses.CourseCode,
    StudentId: studentCourse.Students.StudentId,
    StudentName: studentCourse.Students.Persons.AlternativeName,
    Grade: studentCourse.Note,
    LevelName:
      studentCourse.Courses.LevelCourses.length === 1
        ? studentCourse.Courses.LevelCourses[0].Levels.Name
        : "",
    LevelCourses: studentCourse.Courses.LevelCourses.map(
      (levelCourse: LevelCoursesMap) => ({
        Level: levelCourse.Levels.Name,
      }),
    ),
    StudentCourseGrades: studentCourse.StudentCourseGrades.map(
      (studentCourseGrade: StudentCourseGradesByStudentCourseMap) => ({
        StudentCourseGradeId: studentCourseGrade.StudenCourseGradeId,
        Description: studentCourseGrade.Description,
        GradeCoefficientName: studentCourseGrade.GradeCoefficients.Name,
        Grade: studentCourseGrade.Grade,
        CreatedAt: studentCourseGrade.CreatedAt,
        UserId: studentCourseGrade.UserId,
        UserName: studentCourseGrade.Users.UserName,
      }),
    ),
  }));

  return res;
};

export default getStudentCourseGradesByStudentCourseQuery;
