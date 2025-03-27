import StudentCoursesTable from "./studentCoursesTable";
import getAllStudentCoursesQuery from "@/repositories/studentCourses/queries/getAllStudentCoursesQuery";
import getLastsScholarYearsWithPeriodsQuery from "@/repositories/scholarYears/queries/getLastsScholarYearsWithPeriodsQuery";
import getAllScholarPeriodsByScholarYearIdQuery from "@/repositories/scholarPeriods/queries/getAllScholetPeroidsByScholarYearIdQuery";
import frFR from "@/lang/fr-FR";

export default async function StudentsCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const scholarYears = await getLastsScholarYearsWithPeriodsQuery();
  const scholarPeriods = await getAllScholarPeriodsByScholarYearIdQuery(
    searchParams.scholarYear
      ? parseInt(searchParams.scholarYear as string)
      : scholarYears[0].ScholarYearId,
  );

  // getAllStudentCoursesQuery Params
  const scholarYear = searchParams.scholarYear
    ? parseInt(searchParams.scholarYear as string)
    : scholarYears[0].ScholarYearId;
  const scholarPeriodId = searchParams.scholarPeriodId
    ? parseInt(searchParams.scholarPeriodId as string)
    : scholarPeriods[0].ScholarPeriodId;

  const studentCourses = await getAllStudentCoursesQuery({
    ScholarYearId: scholarYear,
    ScholarPeriodId: scholarPeriodId,
  });

  const scholarPeriodsTous = [
    ...scholarPeriods,
    {
      ScholarPeriodId: 0,
      Name: "Tous",
      Number: 0,
      FromDate: null,
      ToDate: null,
      IsActive: false,
      ScholarYearId: 0,
    },
  ];

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.studentCourses.title}
          </span>
        </div>
        <StudentCoursesTable
          studentCoursesData={studentCourses}
          scholarYears={scholarYears}
          scholarPeriods={scholarPeriodsTous}
          urlParams={searchParams}
        />
        {/* <pre>{JSON.stringify(studentCourses, null, 2)}</pre> */}
      </div>
    </main>
  );
}
