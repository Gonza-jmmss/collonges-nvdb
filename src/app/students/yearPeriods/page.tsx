import YearPeriodsTable from "./yearPeriodsTable";
import getAllYearPeriodsQuery from "@/repositories/yearPeriods/queries/getAllYearPeriodsQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function YearPeriodsPage({
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

  const isEnabledParam =
    searchParams?.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  const yearPeriods = await getAllYearPeriodsQuery({
    IsEnabled: isEnabledParam,
  });

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/students`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.yearPeriods.title}</span>
      </div>
      <YearPeriodsTable
        yearPeriodsData={yearPeriods}
        isEnabledSelected={isEnabledParam}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(yearPeriods, null, 2)}</pre> */}
    </main>
  );
}
