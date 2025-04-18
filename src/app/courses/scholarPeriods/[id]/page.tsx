import getScholarPeriodByIdQuery from "@/repositories/scholarPeriods/queries/getScholarPeriodByIdQuery";
import getLastsScholarYearsQuery from "@/repositories/scholarYears/queries/getLastsScholarYearsQuery";
import ScholarPeriodForm from "@/components/scholarPeriods/scholarPeriodForm";
import frFR from "@/lang/fr-FR";

export default async function ScholarPeriodsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let scholarPeriod;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  if (params.id != "create") {
    scholarPeriod = await getScholarPeriodByIdQuery(Number(params.id));
  } else {
    scholarPeriod = null;
  }

  const scholarYears = await getLastsScholarYearsQuery();

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.scholarPeriods.scholarPeriod} 
    ${action != "create" ? `: ${scholarPeriod ? scholarPeriod.Name : ""}` : ""}`}`;

  return (
    <main className="mt-5 flex justify-center">
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <ScholarPeriodForm
            scholarPeriodData={scholarPeriod}
            scholarYears={scholarYears}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
          />
        </div>
        {/* <pre>{JSON.stringify(module, null, 2)}</pre> */}
      </div>
    </main>
  );
}
