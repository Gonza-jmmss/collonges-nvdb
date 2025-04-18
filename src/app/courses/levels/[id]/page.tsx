import getLevelByIdQuery from "@/repositories/levels/queries/getLevelByIdQuery";
import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import LevelForm from "@/components/levels/levelForm";
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
  let level;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const isEnabledParam =
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  if (params.id != "create") {
    level = await getLevelByIdQuery(Number(params.id));
  } else {
    level = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.levels.levels} 
    ${action != "create" ? `: ${level ? level.Name : ""}` : ""}`}`;

  const periodNumber = searchParams?.periodNumber
    ? parseInt(searchParams.periodNumber as string)
    : PeriodEnum["Cours d'été"];

  const courses = await getAllCoursesQuery({
    IsEnabled: true,
    PeriodNumber: periodNumber,
  });
  const allCourses = await getAllCoursesQuery({
    IsEnabled: true,
    PeriodNumber: 0,
  });

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/courses/levels?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <LevelForm
            levelData={level}
            courses={courses}
            allCourses={allCourses}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(level, null, 2)}</pre> */}
      </div>
    </main>
  );
}
