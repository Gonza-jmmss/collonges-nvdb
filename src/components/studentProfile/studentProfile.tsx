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
  searchParams,
}: {
  student: StudentViewModel | null;
  countries: CountryViewModel[];
  courses: StudentCourseGradesByStudentIdViewModel[];
  userId: number | null;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageIndex = searchParams?.pageIndex
    ? parseInt(searchParams.pageIndex as string)
    : 0;
  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 10;

  return (
    <div>
      <StudentInfo student={student} countries={countries} userId={userId} />
      <StudentCourses
        courses={courses}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
    </div>
  );
}
