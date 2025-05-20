"use client";

import { StudentViewModel } from "@/repositories/students/studentsViewModel";
import { CountryViewModel } from "@/repositories/countries/countriesViewModel";
import { StudentCourseGradesByStudentIdViewModel } from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";
import StudentInfo from "./studentInfo";
import StudentCourses from "./studentCourses";
import frFR from "@/lang/fr-FR";

export default function StudentProfile({
  student,
  countries,
  courses,
  userId,
}: {
  student: StudentViewModel | null;
  countries: CountryViewModel[];
  courses: StudentCourseGradesByStudentIdViewModel[];
  userId: number | null;
}) {
  return (
    <div>
      <StudentInfo student={student} countries={countries} userId={userId} />
      <StudentCourses courses={courses} />
    </div>
  );
}
