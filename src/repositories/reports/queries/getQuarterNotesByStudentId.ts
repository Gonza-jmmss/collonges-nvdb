import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import {
  QuarterNotesResultViewModel,
  StudentCourseMapViewModel,
} from "@/repositories/reports/viewModels/StudentNotesViewModel";
import translateGrade from "@/functions/translateGrade";

const prisma = new PrismaClient();

export class getQuarterNotesByStudentId
  implements Query<QuarterNotesResultViewModel, number>
{
  async execute(studentId: number): Promise<QuarterNotesResultViewModel> {
    const result = await prisma.students.findUnique({
      where: {
        StudentId: studentId,
      },
      include: {
        Persons: {
          include: {
            Countries: true,
          },
        },
        Colleges: true,
        StudentCourses: {
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
            ScholarYears: {
              select: {
                Name: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    return {
      StudentName: result?.Persons.AlternativeName,
      StudentFirstName: result?.Persons.FirstName,
      StudentLastName: result?.Persons.LastName,
      DBaseCode: result?.Persons.DBaseCode,
      Birthdate: result?.Persons.BirthDate,
      BirthCountryFr: result?.Persons.Countries?.Name,
      BirthCountryEn: result?.Persons.Countries?.NameEnglish,
      BirthCity: result?.Persons.BirthCity,
      CollegeAbbreviation: result?.Colleges?.Abbreviation,
      CourseNotes: result?.StudentCourses.map(
        (studentCourse: StudentCourseMapViewModel) => ({
          CourseCode: studentCourse.Courses.CourseCode,
          Quarter: studentCourse.Courses.PeriodNumber,
          CourseName: studentCourse.Courses.Name,
          CoursEnglishName: studentCourse.Courses.EnglishName,
          ScholarYear: studentCourse.ScholarYears.Name,
          CreditAmount: studentCourse.Courses.CreditAmount,
          Note: studentCourse.Note,
          AmericanNote: translateGrade(studentCourse.Note),
        }),
      ),
    };
  }
}
