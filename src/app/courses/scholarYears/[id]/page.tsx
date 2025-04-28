import getScholarYearByIdQuery from "@/repositories/scholarYears/queries/getScholarYearByIdQuery";
import ScholarYearForm from "@/components/scholarYears/scholarYearForm";
import frFR from "@/lang/fr-FR";

export default async function ScholarPeriodsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let scholarYear;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    scholarYear = await getScholarYearByIdQuery(Number(params.id));
  } else {
    scholarYear = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.scholarYears.scholarYear} 
    ${action != "create" ? `: ${scholarYear ? scholarYear.Name : ""}` : ""}`}`;

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <ScholarYearForm scholarYearData={scholarYear} action={action} />
        </div>
        {/* <pre>{JSON.stringify(scholarYear, null, 2)}</pre> */}
      </div>
    </div>
  );
}
