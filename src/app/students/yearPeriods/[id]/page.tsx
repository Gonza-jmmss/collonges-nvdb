import getYearPeriodByIdQuery from "@/repositories/yearPeriods/queries/getYearPeriodByIdQuery";
import getAllScholarYearsQuery from "@/repositories/scholarYears/queries/getAllScholarYearsQuery";
import YearPeriodForm from "@/components/yearPeriods/yearPeriodForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import frFR from "@/lang/fr-FR";

export default async function YearPeriodPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const isEnabledParam =
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  let yearPeriod;

  if (params.id !== "create") {
    yearPeriod = await getYearPeriodByIdQuery({
      YearPeriodId: Number(params.id),
    });
  } else {
    yearPeriod = null;
  }

  const scholarYears = await getAllScholarYearsQuery();

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/students/yearPeriods?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.yearPeriods.yearPeriod}
          </span>
        </div>
        <YearPeriodForm
          yearPeriodData={yearPeriod}
          scholarYears={scholarYears}
          pageIndexParam={pageIndexParam}
          pageSizeParam={pageSizeParam}
          action={action}
          urlParams={searchParams}
        />
      </div>
    </main>
  );
}
