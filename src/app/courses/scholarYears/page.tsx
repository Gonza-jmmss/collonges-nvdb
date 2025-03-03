import ScholarYearsTable from "./scholarYearsTable";
import getAllScholarYearsQuery from "@/repositories/scholarYears/queries/getAllScholarYearsQuery";
import frFR from "@/lang/fr-FR";

export default async function ScholarYearsPage({}: {}) {
  const t = frFR;

  const scholarYears = await getAllScholarYearsQuery();

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.scholarYears.title}</span>
        </div>
        <ScholarYearsTable scholarYears={scholarYears} />
        {/* <pre>{JSON.stringify(scholarYears, null, 2)}</pre> */}
      </div>
    </main>
  );
}
