import getGradeCoefficientByIdQuery from "@/repositories/gradeCoefficients/queries/getGradeCoefficientByIdQuery";
import GradeCoeficientForm from "@/components/gradeCoefficients/gradeCoefficientForm";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let gradeCoefficient;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    gradeCoefficient = await getGradeCoefficientByIdQuery(Number(params.id));
  } else {
    gradeCoefficient = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.gradeCoefficients.gradeCoefficient} 
    ${action != "create" ? `: ${gradeCoefficient ? gradeCoefficient.Name : ""}` : ""}`}`;

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <GradeCoeficientForm
            gradeCoefficientData={gradeCoefficient}
            action={action}
          />
        </div>
        {/* <pre>{JSON.stringify(gradeCoefficient, null, 2)}</pre> */}
      </div>
    </div>
  );
}
