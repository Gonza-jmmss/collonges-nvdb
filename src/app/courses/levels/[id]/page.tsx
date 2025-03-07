import getLevelByIdQuery from "@/repositories/levels/queries/getLevelByIdQuery";
import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import LevelForm from "@/components/levels/levelForm";
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

  if (params.id != "create") {
    level = await getLevelByIdQuery(Number(params.id));
  } else {
    level = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.levels.levels} 
    ${action != "create" ? `: ${level ? level.Name : ""}` : ""}`}`;

  const period = searchParams?.period
    ? parseInt(searchParams.period as string)
    : 4;

  const courses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: period,
  });
  const allCourses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: 0,
  });

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <LevelForm
            levelData={level}
            courses={courses}
            allCourses={allCourses}
            action={action}
          />
        </div>
        {/* <pre>{JSON.stringify(level, null, 2)}</pre> */}
      </div>
    </div>
  );
}
