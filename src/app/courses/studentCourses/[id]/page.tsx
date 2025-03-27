import getStudentCoursesByStudentIdQuery from "@/repositories/studentCourses/queries/getStudentCoursesByStudentIdQuery";
import getStudentsWithNoCoursesQuery from "@/repositories/studentCourses/queries/getSudentsWithNoCoursesQuery";
import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import getLastsScholarPeriodsQuery from "@/repositories/scholarPeriods/queries/getLastsScholarPeriodsQuery";
import StudentCourseForm from "@/components/studentCourses/studentCoursesForm";
import frFR from "@/lang/fr-FR";

export default async function StudentCoursesPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let studentCourses;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const studentsWithNoCourses = await getStudentsWithNoCoursesQuery();

  const period = searchParams?.period
    ? parseInt(searchParams.period as string)
    : 4;

  const courses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: period,
  });
  const allCourses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: 0,
  });

  const scholarPeriods = await getLastsScholarPeriodsQuery();

  if (params.id != "create") {
    studentCourses = await getStudentCoursesByStudentIdQuery({
      StudentId: Number(params.id),
      ScholarPeriodId: searchParams.scholarPeriodId
        ? parseInt(searchParams.scholarPeriodId as string)
        : scholarPeriods[0].ScholarPeriodId,
    });
  } else {
    studentCourses = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourses.studentCourse}
      ${action != "create" ? `: ${studentCourses ? studentCourses.AlternativeName : ""}` : ""}`}`;

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md lg:w-[50vw]">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <StudentCourseForm
            studentCoursesData={studentCourses}
            studentsWithNoCourses={studentsWithNoCourses}
            courses={courses}
            allCourses={allCourses}
            scholarPeriods={scholarPeriods}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(studentCourses, null, 2)}</pre>
        <pre>{JSON.stringify(studentsWithNoCourses, null, 2)}</pre> */}
      </div>
    </div>
  );
}
