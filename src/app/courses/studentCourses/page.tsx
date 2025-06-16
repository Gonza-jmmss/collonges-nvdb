import StudentCoursesTable from "./studentCoursesTable";
import getAllStudentCoursesQuery from "@/repositories/studentCourses/queries/getAllStudentCoursesQuery";
import getLastsScholarYearsWithPeriodsQuery from "@/repositories/scholarYears/queries/getLastsScholarYearsWithPeriodsQuery";
import getAllScholarPeriodsByScholarYearIdQuery from "@/repositories/scholarPeriods/queries/getAllScholetPeroidsByScholarYearIdQuery";
import getAllLevelsQuery from "@/repositories/levels/queries/getAllLevelsQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function StudentsCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const session = await auth();

  const userRoleName = session?.user.userData.Roles.Name;

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

  const scholarLevels = await getAllLevelsQuery({ IsEnabled: true });

  const scholarLevelIdParam =
    searchParams.scholarLevelId && searchParams.scholarLevelId !== "null"
      ? parseInt(searchParams.scholarLevelId as string)
      : null;

  const studentCourses = await getAllStudentCoursesQuery({
    ScholarYearId: scholarYearIdParam,
    ScholarPeriodId: scholarPeriodIdParam,
    PeriodNumber: scholarPeriods.find(
      (x) => x.ScholarPeriodId === scholarPeriodIdParam,
    )?.Number,
    scholarLevelId: scholarLevelIdParam,
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
        scholarLevelSelected={scholarLevelIdParam}
        scholarLevels={scholarLevels}
        userRoleName={userRoleName}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(studentCourses, null, 2)}</pre> */}
    </main>
  );
}
