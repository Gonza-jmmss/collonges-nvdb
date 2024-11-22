import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import { QuarterNotesResultViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";

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
      DBaseCode: result?.Persons.DBaseCode,
      BirthDate: result?.Persons.BirthDate,
      BirthCountry: result?.Persons.Countries?.Name,
      BirthCity: result?.Persons.BirthCity,
      CourseNotes: result?.StudentCourses.map((studentCourse) => ({
        CourseCode: studentCourse.Courses.CourseCode,
        Quarter: studentCourse.Courses.PeriodNumber,
        CourseName: studentCourse.Courses.Name,
        CoursEnglishName: studentCourse.Courses.EnglishName,
        ScholarYear: studentCourse.ScholarYears.Name,
        CreditAmount: studentCourse.Courses.CreditAmount,
        Note: studentCourse.Note,
      })),
    };
  }
}

// return result.map((student) => ({
//   StudentName: student.Persons.AlternativeName,
//   DBaseCode: student.Persons.DBaseCode,
//   BirthDate: student.Persons.BirthDate,
//   BirthCountry: student.Persons.Countries?.Name,
//   BirthCity: student.Persons.BirthCity,
//   CourseNotes: student.StudentCourses.map((studentCourse) => ({
//     CourseCode: studentCourse.Courses.CourseCode,
//     Quarter: studentCourse.Courses.PeriodNumber,
//     CourseName: studentCourse.Courses.Name,
//     CoursEnglishName: studentCourse.Courses.EnglishName,
//     ScholarYear: studentCourse.ScholarYears.Name,
//     CreditAmount: studentCourse.Courses.CreditAmount,
//     Note: studentCourse.Note,
//   })),
// }));
