import CourseContentVisualization from "@/components/studentTextBooks/courseContentVisualization";
import getCourseTextbookByCourseIdAndTextbookDateQuery from "@/repositories/courseTextbook/queries/getCourseTextbookByCourseIdAndTextbookDateQuery";
import getCoursesByTeacherQuery from "@/repositories/courses/queries/getCoursesByTeacherQuery";
import getCurrentScholarPeriodQuery from "@/repositories/scholarPeriods/queries/getCurrentScholarPeriod";
import getCurrentLevelsQuery from "@/repositories/levels/queries/getCurrentLevelsQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import formatDate from "@/functions/formatDate";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const session = await auth();

  const courseIdParam = parseInt(searchParams.courseId as string);
  const textbookDateParam = new Date(searchParams.textbookDate as string);
  const ReferenceDateParam = new Date(searchParams.referenceDate as string);

  const currentScholarPeriod = await getCurrentScholarPeriodQuery();

  const courses = await getCoursesByTeacherQuery({
    IsEnabled: true,
    Period: currentScholarPeriod.Number,
    RoreName: session ? session.user.userData.Roles.Name : "",
    UserId: session ? parseInt(session.user.id) : 0,
    LevelId: null,
  });

  const levels = await getCurrentLevelsQuery();

  let textbook;

  if (params.id != "create") {
    textbook = await getCourseTextbookByCourseIdAndTextbookDateQuery({
      CourseId: courseIdParam,
      ReferenceDate: ReferenceDateParam,
    });
  } else {
    textbook = null;
  }

  const pagetitle = `${`${t.shared.view} ${t.courseTextbooks.courseTextbook} 
    ${`: ${textbook?.CourseCode} ${textbook?.CourseName} - ${formatDate(textbook?.ContentDate || new Date())}`}`}`;
  const mobilePageTitle = `${t.shared.view} ${t.courseTextbooks.courseTextbook}:`;

  return (
    <main className="flex w-[92vw] sm:w-[80vw]">
      {/* Desktop */}
      <div className="hidden sm:relative sm:mt-5 sm:flex sm:w-full sm:justify-center">
        <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
          <Link
            href={`/studentHome/textbooks?textbookDate=${textbookDateParam.toUTCString()}`}
          >
            <Icon name={"MdArrowBack"} className="text-xl" />
          </Link>
        </Button>
        {/* <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md lg:w-[50vw]"> */}
        <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
          <div className="flex items-center justify-between text-lg font-medium">
            {pagetitle}
          </div>
          <div className="mt-5 w-full">
            <CourseContentVisualization
              courseContentData={textbook}
              courses={courses}
              levels={levels}
              urlParams={searchParams}
            />
          </div>
          {/* <pre>{JSON.stringify(textbook, null, 2)}</pre> */}
        </div>
      </div>
      {/* Mobile */}
      <div className="flex w-full flex-col space-y-2 sm:hidden">
        {/* <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md lg:w-[50vw]"> */}
        <div className="mt-3 w-full rounded-md border bg-muted/60 p-5 shadow-md">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">{mobilePageTitle}</span>
          </div>
          <div className="mt-5">
            <CourseContentVisualization
              courseContentData={textbook}
              courses={courses}
              levels={levels}
              urlParams={searchParams}
            />
          </div>
          {/* <pre>{JSON.stringify(textbook, null, 2)}</pre> */}
        </div>
      </div>
    </main>
  );
}
