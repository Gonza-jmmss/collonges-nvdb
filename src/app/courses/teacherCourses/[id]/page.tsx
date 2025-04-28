import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import TeacherCoursesForm from "@/components/teacherCourses/teacherCoursesForm";
import getTeacherCoursesByIdQuery from "@/repositories/teacherCourses/queries/getTeacherCoursesByIdQuery";
import getCurrentLevelsQuery from "@/repositories/levels/queries/getCurrentLevelsQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PeriodEnum } from "@/enum/periodEnum";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let teacherCourses;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  if (params.id != "create") {
    teacherCourses = await getTeacherCoursesByIdQuery({
      UserId: Number(params.id),
    });
  } else {
    teacherCourses = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.teacherCourses.teacherCourses} 
    ${action != "create" ? `: ${teacherCourses ? teacherCourses.UserName : ""}` : ""}`}`;

  const periodNumber = searchParams?.periodNumber
    ? parseInt(searchParams.periodNumber as string)
    : PeriodEnum["Cours d'été"];
  const levelId = parseInt(searchParams.levelId as string) || null;

  const courses = await getAllCoursesQuery({
    IsEnabled: true,
    PeriodNumber: periodNumber,
    LevelId: levelId,
  });
  const allCourses = await getAllCoursesQuery({
    IsEnabled: true,
    PeriodNumber: 0,
  });

  const levels = await getCurrentLevelsQuery();

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link href={`/courses/teacherCourses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <TeacherCoursesForm
            teacherCoursesData={teacherCourses}
            courses={courses}
            allCourses={allCourses}
            levels={levels}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(teacherCourses, null, 2)}</pre> */}
      </div>
    </main>
  );
}
