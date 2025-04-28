import ScholarPeriodsTable from "./scholarPeriodsTable";
import getAllScholarPeriodsTableQuery from "@/repositories/scholarPeriods/queries/getAllScholarPeriodsTableQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function ScholarPeriodsPage({
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

  const scholarPeriods = await getAllScholarPeriodsTableQuery();

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.scholarPeriods.title}</span>
      </div>
      <ScholarPeriodsTable
        scholarPeriods={scholarPeriods}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
      {/* <pre>{JSON.stringify(scholarPeriods, null, 2)}</pre> */}
    </main>
  );
}
