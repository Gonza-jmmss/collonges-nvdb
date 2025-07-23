import TeacherCoursesTable from "./teacherCoursesTable";
import getAllTeracherCoursesQuery from "@/repositories/teacherCourses/queries/getAllTeacherCoursesQuery";
import getCurrentScholarPeriodQuery from "@/repositories/scholarPeriods/queries/getCurrentScholarPeriod";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { PeriodEnum } from "@/enum/periodEnum";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function TeacherCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const currentScholarPeriod = await getCurrentScholarPeriodQuery();

  const periodNumberParam = searchParams?.periodNumber
    ? parseInt(searchParams.periodNumber as string)
    : currentScholarPeriod.Number;

  const teacherCourses = await getAllTeracherCoursesQuery({
    PeriodNumber: periodNumberParam,
  });

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{`${t.teacherCourses.title} - ${PeriodEnum[periodNumberParam]}`}</span>
        {/* <span className="text-xl font-semibold">{`${t.teacherCourses.title} - ${searchParams?.periodNumber ? PeriodEnum[periodNumberParam] : PeriodEnum[currentScholarPeriod.Number]}`}</span> */}
      </div>
      <TeacherCoursesTable
        teacherCourses={teacherCourses}
        periodNumberSelected={periodNumberParam}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(teacherCourses, null, 2)}</pre> */}
    </main>
  );
}
