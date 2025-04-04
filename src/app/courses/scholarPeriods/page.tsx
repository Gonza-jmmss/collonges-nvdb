import ScholarPeriodsTable from "./scholarPeriodsTable";
import getAllScholarPeriodsTableQuery from "@/repositories/scholarPeriods/queries/getAllScholarPeriodsTableQuery";
import frFR from "@/lang/fr-FR";

export default async function ScholarPeriodsPage({}: {}) {
  const t = frFR;

  const scholarPeriods = await getAllScholarPeriodsTableQuery();

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.scholarPeriods.title}
          </span>
        </div>
        <ScholarPeriodsTable scholarPeriods={scholarPeriods} />
        {/* <pre>{JSON.stringify(scholarPeriods, null, 2)}</pre> */}
      </div>
    </main>
  );
}
