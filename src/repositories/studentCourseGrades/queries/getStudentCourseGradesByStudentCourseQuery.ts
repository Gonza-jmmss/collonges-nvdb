import { PrismaClient } from "@prisma/client";
// import getActiveScholarYearQuery from "@/repositories/scholarYears/queries/getActiveScholarYearQuery";
import {
  StudentCourseByStudentCourseMap,
  LevelCoursesMap,
  StudentCourseGradesByStudentCourseMap,
} from "../studentCourseGradesViewModel";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { PeriodEnum } from "@/enum/periodEnum";

const prisma = new PrismaClient();

type getStudentCourseGradesByStudentCourseQueryParamsType = {
  CourseId: number;
  // PeriodNumber: number;
  ScholarPeriodId: number;
};

// #################### //
// Je laisse commenter la logique du « PeriodNumber » et « activeScholarYear » au cas où des bugs apparaîtraient
// #################### //

const getStudentCourseGradesByStudentCourseQuery = async (
  params: getStudentCourseGradesByStudentCourseQueryParamsType,
) => {
  // const activeScholarYear = await getActiveScholarYearQuery();

  const query = await prisma.studentCourses.findMany({
    orderBy: { Students: { Persons: { AlternativeName: "asc" } } },
    where: {
      CourseId: params.CourseId,
      //
      //
      // ScholarPeriods: {
      //   ScholarYearId: activeScholarYear.ScholarYearId,
      //   Number: params.PeriodNumber,
      // },
      ScholarPeriods: {
        // ScholarYearId: activeScholarYear.ScholarYearId,
        // Number: params.PeriodNumber,
        ScholarPeriodId: params.ScholarPeriodId,
      },
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
        CreatedAt: studentCourseGrade.CreatedAt,
        UserId: studentCourseGrade.UserId,
        UserName: studentCourseGrade.Users.UserName,
      }),
    ),
  }));

  return res;
};

export default getStudentCourseGradesByStudentCourseQuery;
