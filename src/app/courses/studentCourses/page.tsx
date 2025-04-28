import StudentCoursesTable from "./studentCoursesTable";
import getAllStudentCoursesQuery from "@/repositories/studentCourses/queries/getAllStudentCoursesQuery";
import getLastsScholarYearsWithPeriodsQuery from "@/repositories/scholarYears/queries/getLastsScholarYearsWithPeriodsQuery";
import getAllScholarPeriodsByScholarYearIdQuery from "@/repositories/scholarPeriods/queries/getAllScholetPeroidsByScholarYearIdQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function StudentsCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const pageIndex = searchParams?.pageIndex
    ? parseInt(searchParams.pageIndex as string)
    : 0;

  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 10;

  const scholarYears = await getLastsScholarYearsWithPeriodsQuery();

  const scholarYearIdParam = searchParams.scholarYearId
    ? parseInt(searchParams.scholarYearId as string)
    : scholarYears[0].ScholarYearId;

  const scholarPeriods = await getAllScholarPeriodsByScholarYearIdQuery({
    ScholarYearId: scholarYearIdParam,
  });

  const scholarPeriodIdParam =
    searchParams.scholarPeriodId && searchParams.scholarPeriodId !== "null"
      ? parseInt(searchParams.scholarPeriodId as string)
      : scholarPeriods[0].ScholarPeriodId;

  const studentCourses = await getAllStudentCoursesQuery({
    ScholarYearId: scholarYearIdParam,
    ScholarPeriodId: scholarPeriodIdParam,
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
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.studentCourses.title}</span>
      </div>
      <StudentCoursesTable
        studentCoursesData={studentCourses}
        scholarYearSelected={scholarYearIdParam}
        scholarYears={scholarYears}
        scholarPeriodSelected={scholarPeriodIdParam}
        scholarPeriods={scholarPeriodsTous}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(studentCourses, null, 2)}</pre> */}
    </main>
  );
}
