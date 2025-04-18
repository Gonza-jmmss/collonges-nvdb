import CoursesTable from "./coursesTable";
import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function CoursesPage({
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
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.courses.title}</span>
      </div>
      <CoursesTable
        coursesData={courses}
        isEnabledSelected={isEnabledParam}
        periodNumberSelected={periodNumberParam}
        userRoleName={userRoleName}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
    </main>
  );
}
