import StudentsTable from "./studentsTable";
import getAllStudentsQuery from "@/repositories/students/queries/getAllStudentsQuery";
import getAllYearPeriodsQuery from "@/repositories/yearPeriods/queries/getAllYearPeriodsQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function StudentsPage({
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

  const userRoleName = session?.user.userData.Roles.Name;

  // const isEnabled = searchParams?.isEnabled === "false" ? false : true;
  const isEnabledParam =
    searchParams?.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  const yearPeriods = await getAllYearPeriodsQuery({ IsEnabled: true });
  const yearPeriodIdSelected = searchParams?.yearPeriodId
    ? searchParams.yearPeriodId !== "null"
      ? parseInt(searchParams.yearPeriodId as string)
      : yearPeriods[0].YearPeriodId
    : yearPeriods[0].YearPeriodId;

  const students = await getAllStudentsQuery({
    IsEnabled: isEnabledParam,
    YearPeriodId: yearPeriodIdSelected || 0,
  });

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/students`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.students.pageTitle}</span>
      </div>
      <StudentsTable
        studentsData={students}
        yearPeriods={yearPeriods}
        yearPeriodIdSelected={yearPeriodIdSelected}
        isEnabledSelected={isEnabledParam}
        userRoleName={userRoleName}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
    </main>
  );
}
