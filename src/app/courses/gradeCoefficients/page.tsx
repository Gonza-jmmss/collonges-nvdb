import GradeCoefficientsTable from "./gradeCoefficientsTable";
import getAllGradeCoefficientsQuery from "@/repositories/gradeCoefficients/queries/getAllGradeCoefficientsQuery";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function GradeCoefficientsPage({
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
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  const coefficientPeriodParam = searchParams?.coefficientPeriod
    ? parseInt(searchParams.coefficientPeriod as string)
    : 0;

  const gradeCoefficients = await getAllGradeCoefficientsQuery({
    IsEnabled: isEnabledParam,
    CoefficientPeriod: coefficientPeriodParam,
  });

  return (
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">
          {t.gradeCoefficients.title}
        </span>
      </div>
      <GradeCoefficientsTable
        gradeCoefficients={gradeCoefficients}
        isEnabledSelected={isEnabledParam}
        coefficientPeriodSelected={coefficientPeriodParam}
        pageIndex={pageIndex}
        pageSize={pageSize}
        urlParams={searchParams}
      />
      {/* <pre>{JSON.stringify(gradeCoefficients, null, 2)}</pre> */}
    </main>
  );
}
