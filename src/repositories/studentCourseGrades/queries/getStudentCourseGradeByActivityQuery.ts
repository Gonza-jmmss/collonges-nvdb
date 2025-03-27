import { PrismaClient } from "@prisma/client";
import {
  StudentCourseGradeByActivityViewModel,
  StudentCourseGradeByActivity,
  StudentCourseGradesByGradeCoefficientMap,
  LevelCoursesMap,
} from "../studentCourseGradesViewModel";

const prisma = new PrismaClient();

type getStudentCourseGradeByActivityQueryParamsType = {
  CourseId: number;
};

const getStudentCourseGradeByActivityQuery = async (
  params: getStudentCourseGradeByActivityQueryParamsType,
) => {
  const query = await prisma.studentCourseGrades.findMany({
    where: { StudentCourses: { CourseId: params.CourseId } },
    orderBy: { CreatedAt: "desc" },
    include: {
      GradeCoefficients: true,
      Users: true,
      StudentCourses: {
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
          ScholarPeriods: {
            include: {
              ScholarYears: true,
            },
          },
        },
      },
    },
  });

  // Create an intermediate mapping to help with grouping
  const groupMap: Record<string, StudentCourseGradeByActivityViewModel> = {};

  // Process each record
  query.forEach(
    (studentCourseGrade: StudentCourseGradesByGradeCoefficientMap) => {
      const description = studentCourseGrade.Description || "Undefined";

      // Create student course entry
      const studentEntry: StudentCourseGradeByActivity = {
        StudentCourseGradeId: studentCourseGrade.StudenCourseGradeId,
        StudentCourseId: studentCourseGrade.StudentCourseId,
        StudentId: studentCourseGrade.StudentCourses.StudentId,
        StudentName:
          studentCourseGrade.StudentCourses.Students.Persons.AlternativeName,
        Grade: studentCourseGrade.Grade,
        AverageGrade: studentCourseGrade.StudentCourses.Note,
      };

      // If this description is not in our map yet, create the base object
      if (!groupMap[description]) {
        groupMap[description] = {
          Description: studentCourseGrade.Description,
          CreatedAt: studentCourseGrade.CreatedAt,
          UserId: studentCourseGrade.UserId,
          UserName: studentCourseGrade.Users.UserName,
          Coefficient: Number(studentCourseGrade.GradeCoefficients.Coefficient),
          GradeCoefficientId: studentCourseGrade.GradeCoefficientId,
          GradeCoefficientName: studentCourseGrade.GradeCoefficients.Name,
          LevelName:
            studentCourseGrade.StudentCourses.Courses.LevelCourses.length === 1
              ? studentCourseGrade.StudentCourses.Courses.LevelCourses[0].Levels
                  .Name
              : "",
          LevelCourses:
            studentCourseGrade.StudentCourses.Courses.LevelCourses.map(
              (levelCourse: LevelCoursesMap) => ({
                Level: levelCourse.Levels.Name,
              }),
            ),
          Activities: [], // Start with empty array
        };
      }

      // Add student entry to the appropriate group
      groupMap[description].Activities.push(studentEntry);
    },
  );

  // Convert map to array
  const result = Object.values(groupMap);

  return result;
};

export default getStudentCourseGradeByActivityQuery;
