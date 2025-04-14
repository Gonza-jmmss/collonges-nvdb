import CoursesTable from "./coursesTable";
import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import frFR from "@/lang/fr-FR";

export default async function CoursesPage({
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

  // const isEnabled = searchParams?.isEnabled === "false" ? false : true;
  // const period =
  //   typeof searchParams?.period === "string"
  //     ? parseInt(searchParams?.period)
  //     : 4;
  const isEnabledParam =
    searchParams?.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";
  const periodNumberParam = searchParams?.periodNumber
    ? parseInt(searchParams.periodNumber as string)
    : 4;

  const courses = await getAllCoursesQuery({
    IsEnabled: isEnabledParam,
    Period: periodNumberParam,
  });

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.courses.title}</span>
        </div>
        <CoursesTable
          coursesData={courses}
          isEnabledSelected={isEnabledParam}
          periodNumberSelected={periodNumberParam}
          pageIndex={pageIndex}
          pageSize={pageSize}
          urlParams={searchParams}
        />
        {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
      </div>
    </main>
  );
}
