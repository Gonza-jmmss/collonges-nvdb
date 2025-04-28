import getGradeCoefficientByIdQuery from "@/repositories/gradeCoefficients/queries/getGradeCoefficientByIdQuery";
import GradeCoeficientForm from "@/components/gradeCoefficients/gradeCoefficientForm";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let gradeCoefficient;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const isEnabledParam =
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  if (params.id != "create") {
    gradeCoefficient = await getGradeCoefficientByIdQuery(Number(params.id));
  } else {
    gradeCoefficient = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.gradeCoefficients.gradeCoefficient} 
    ${action != "create" ? `: ${gradeCoefficient ? gradeCoefficient.Name : ""}` : ""}`}`;

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/courses/gradeCoefficients?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <GradeCoeficientForm
            gradeCoefficientData={gradeCoefficient}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(gradeCoefficient, null, 2)}</pre> */}
      </div>
    </main>
  );
}
