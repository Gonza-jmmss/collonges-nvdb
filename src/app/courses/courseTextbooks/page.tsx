import CourseTextbookTable from "./courseTextbookTable";
import getCourseContentsByDayQuery from "@/repositories/courseTextbook/queries/getCourseContentsByDayQuery";
import getCoursesByTeacherQuery from "@/repositories/courses/queries/getCoursesByTeacherQuery";
import getCurrentScholarPeriodQuery from "@/repositories/scholarPeriods/queries/getCurrentScholarPeriod";
import getAllScholarPeriodsTableQuery from "@/repositories/scholarPeriods/queries/getAllScholarPeriodsTableQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function CourseTextbooksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const session = await auth();

  const pageIndex = searchParams?.pageIndex
    ? parseInt(searchParams.pageIndex as string)
    : 0;

  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 10;

  const textbookDateParam = searchParams.textbookDate
    ? new Date(searchParams.textbookDate as string)
    : new Date();

  // const currentScholarPeriod = await getCurrentScholarPeriodQuery();

  const scholarPeriods = await getAllScholarPeriodsTableQuery();

  const scholarPeriodIdParam =
    searchParams.scholarPeriodId && searchParams.scholarPeriodId !== "null"
      ? parseInt(searchParams.scholarPeriodId as string)
      : scholarPeriods[0].ScholarPeriodId;

  const periodNumberSelected =
    scholarPeriods.find((x) => x.ScholarPeriodId === scholarPeriodIdParam)
      ?.Number ?? scholarPeriods[0].Number;

  const courses = await getCoursesByTeacherQuery({
    IsEnabled: true,
    Period: periodNumberSelected,
    // Period: currentScholarPeriod.Number,
    RoreName: session ? session.user.userData.Roles.Name : "",
    UserId: session ? parseInt(session.user.id) : 0,
    LevelId: null,
  });

  const courseContents = await getCourseContentsByDayQuery({
    TextbookDate: textbookDateParam,
  });

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.courseTextbooks.title}</span>
      </div>
      <CourseTextbookTable
        courseTextbooksData={courseContents}
        textbookDateSelected={textbookDateParam}
        scholarPeriodSelected={scholarPeriodIdParam}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(courseContents, null, 2)}</pre> */}
    </main>
  );
}
