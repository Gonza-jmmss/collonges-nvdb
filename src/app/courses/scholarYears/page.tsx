import ScholarYearsTable from "./scholarYearsTable";
import getAllScholarYearsTableQuery from "@/repositories/scholarYears/queries/getAllScholarYearsQueryTable";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function ScholarYearsPage({}: {}) {
  const t = frFR;

  const scholarYears = await getAllScholarYearsTableQuery();

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.scholarYears.title}</span>
      </div>
      <ScholarYearsTable scholarYears={scholarYears} />
      {/* <pre>{JSON.stringify(scholarYears, null, 2)}</pre> */}
    </main>
  );
}
