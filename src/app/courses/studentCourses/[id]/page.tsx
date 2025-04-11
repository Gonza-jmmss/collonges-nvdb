import getStudentCoursesByStudentIdQuery from "@/repositories/studentCourses/queries/getStudentCoursesByStudentIdQuery";
import getStudentsWithNoCoursesQuery from "@/repositories/studentCourses/queries/getSudentsWithNoCoursesQuery";
import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import getLastsScholarPeriodsQuery from "@/repositories/scholarPeriods/queries/getLastsScholarPeriodsQuery";
import getLastsScholarYearsWithPeriodsQuery from "@/repositories/scholarYears/queries/getLastsScholarYearsWithPeriodsQuery";
import getAllLevelsQuery from "@/repositories/levels/queries/getAllLevelsQuery";
import StudentCourseForm from "@/components/studentCourses/studentCoursesForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
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

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const studentsWithNoCourses = await getStudentsWithNoCoursesQuery();

  const periodIdParam = searchParams?.period
    ? parseInt(searchParams.period as string)
    : 4;

  const scholarYearIdParam = parseInt(searchParams.scholarYearId as string);

  const courses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: periodIdParam,
  });
  const allCourses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: 0,
  });

  const scholarPeriods = await getLastsScholarPeriodsQuery({
    ScholarYearId: scholarYearIdParam,
  });
  const scholarYears = await getLastsScholarYearsWithPeriodsQuery();

  const scholarLevels = await getAllLevelsQuery({ IsEnabled: true });

  const scholarPeriodIdParam = searchParams.scholarPeriodId
    ? parseInt(searchParams.scholarPeriodId as string)
    : scholarPeriods[0].ScholarPeriodId;

  if (params.id != "create") {
    studentCourses = await getStudentCoursesByStudentIdQuery({
      StudentId: Number(params.id),
      ScholarPeriodId: scholarPeriodIdParam,
    });
  } else {
    studentCourses = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourses.studentCourse}
      ${action != "create" ? `: ${studentCourses ? studentCourses.AlternativeName : ""}` : ""}`}`;

  return (
    <div className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/courses/studentCourses?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&scholarPeriodId=${scholarPeriodIdParam}&scholarYearId=${scholarYearIdParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md lg:w-[50vw]">
        {/* <Button asChild className={`absolute left-0`} variant="ghost">
          <Link
            href={`/courses/studentCourses?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&scholarPeriodId=${scholarPeriodIdParam}&scholarYearId=${scholarYearIdParam}`}
          >
            <Icon
              name={
                isValidIconName("MdArrowBack")
                  ? "MdArrowBack"
                  : "MdOutlineNotInterested"
              }
              className="text-xl"
            />
          </Link>
        </Button> */}
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
            scholarYears={scholarYears}
            scholarLevels={scholarLevels}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
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
