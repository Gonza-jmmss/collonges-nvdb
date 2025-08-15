import CourseTextbookForm from "@/components/courseTextbooks/courseTextbookForm";
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

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const action = (searchParams.action as string).replace(/"/g, "");

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

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.courseTextbooks.courseTextbook} 
    ${action != "create" ? `: ${textbook?.CourseCode} ${textbook?.CourseName} - ${formatDate(textbook?.ContentDate || new Date())}` : ""}`}`;

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/courses/courseTextbooks?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&textbookDate=${textbookDateParam.toUTCString()}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      {/* <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md lg:w-[50vw]"> */}
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <CourseTextbookForm
            courseContentData={textbook}
            courses={courses}
            levels={levels}
            tearcherId={session ? parseInt(session.user.id) : 0}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(textbook, null, 2)}</pre> */}
      </div>
    </main>
  );
}
