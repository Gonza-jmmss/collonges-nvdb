import { PrismaClient } from "@prisma/client";
import { StudentCourseMapViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import translateGrade from "@/functions/translateGrade";

const prisma = new PrismaClient();

const getQuarterNotesByStudentId = async (studentId: number) => {
  const query = await prisma.students.findUnique({
    where: {
      StudentId: studentId,
      IsEnabled: true,
    },
    include: {
      Persons: {
        include: {
          Countries: true,
        },
      },
      Colleges: true,
      StudentCourses: {
        where: {
          Note: { not: null },
        },
        include: {
          Courses: {
            select: {
              CourseCode: true,
              CreditAmount: true,
              Name: true,
              EnglishName: true,
              PeriodNumber: true,
            },
          },
          ScholarPeriods: {
            include: {
              ScholarYears: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!query) {
    throw new Error(`Student with ID ${studentId} not found`);
  }

  const res = {
    StudentName: query?.Persons.AlternativeName,
    StudentFirstName: query?.Persons.FirstName,
    StudentLastName: query?.Persons.LastName,
    DBaseCode: query?.Persons.DBaseCode,
    Birthdate: query?.Persons.BirthDate,
    BirthCountryFr: query?.Persons.Countries?.Name,
    BirthCountryEn: query?.Persons.Countries?.NameEnglish,
    BirthCity: query?.Persons.BirthCity,
    CollegeAbbreviation: query?.Colleges?.Abbreviation,
    CourseNotes: query?.StudentCourses.map(
      (studentCourse: StudentCourseMapViewModel) => ({
        CourseCode: studentCourse.Courses.CourseCode,
        Quarter: studentCourse.Courses.PeriodNumber,
        CourseName: studentCourse.Courses.Name,
        CoursEnglishName: studentCourse.Courses.EnglishName,
        ScholarYear: studentCourse.ScholarPeriods.ScholarYears.Name,
        CreditAmount: studentCourse.Courses.CreditAmount,
        Note: studentCourse.Note,
        AmericanNote:
          studentCourse.Note != null
            ? translateGrade(studentCourse.Note)
            : null,
      }),
    ),
  };

  return res;
};

export default getQuarterNotesByStudentId;
