import GradeCoefficientsTable from "./gradeCoefficientsTable";
import getAllGradeCoefficientsQuery from "@/repositories/gradeCoefficients/queries/getAllGradeCoefficientsQuery";
import frFR from "@/lang/fr-FR";

export default async function GradeCoefficientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const isEnabled =
    searchParams?.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  const gradeCoefficients = await getAllGradeCoefficientsQuery({
    IsEnabled: isEnabled,
  });

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.gradeCoefficients.title}
          </span>
        </div>
        <GradeCoefficientsTable gradeCoefficients={gradeCoefficients} />
        {/* <pre>{JSON.stringify(gradeCoefficients, null, 2)}</pre> */}
      </div>
    </main>
  );
}
