import { PrismaClient } from "@prisma/client";
import {
  StudentCourseByStudentCourseMap,
  LevelCoursesMap,
  StudentCourseGradesByStudentCourseMap,
} from "../studentCourseGradesViewModel";
import translateGrade from "@/functions/translateGrade";

const prisma = new PrismaClient();

type getStudentCourseGradeByStudentIdQueryParamsType = {
  StudentId: number;
};

const getStudentCourseGradeByStudentIdQuery = async (
  params: getStudentCourseGradeByStudentIdQueryParamsType,
) => {
  const query = await prisma.studentCourses.findMany({
    where: {
      StudentId: params.StudentId,
    },
    include: {
      Courses: {
        include: {
          LevelCourses: {
            where: { Levels: { IsEnabled: true } },
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
    AmericanGrade: studentCourse.Note && translateGrade(studentCourse.Note),
    ScholarPeriodName: studentCourse.ScholarPeriods.Name,
    ScholarYearName: studentCourse.ScholarPeriods.ScholarYears.Name,
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
        CourseId: studentCourse.CourseId,
        StudentCourseGradeId: studentCourseGrade.StudenCourseGradeId,
        Description: studentCourseGrade.Description,
        ActivityDate: studentCourseGrade.ActivityDate,
        GradeCoefficientName: studentCourseGrade.GradeCoefficients.Name,
        GradeCoefficientPercentage:
          Number(studentCourseGrade.GradeCoefficients.Coefficient) * 100,
        Grade: studentCourseGrade.Grade,
        AmericanGrade:
          studentCourseGrade.Grade && translateGrade(studentCourseGrade.Grade),
        CreatedAt: studentCourseGrade.CreatedAt,
        UserId: studentCourseGrade.UserId,
        UserName: studentCourseGrade.Users.UserName,
      }),
    ),
  }));

  return res;
};

export default getStudentCourseGradeByStudentIdQuery;
