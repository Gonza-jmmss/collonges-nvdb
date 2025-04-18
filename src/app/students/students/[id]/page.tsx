import getStudentByIdQuery from "@/repositories/students/queries/getStudentByIdQuery";
import getAllCountriesQuery from "@/repositories/countries/queries/getAllCountriesQuery";
import getAllCollegesQuery from "@/repositories/colleges/queries/getAllCollegesQuery";
import getAllRegimesQuery from "@/repositories/regimes/queries/getAllRegimesQuery";
import getAllContactTypesQuery from "@/repositories/personContactTypes/queries/getAllPersonContactTypesQuery";
import getAllNonStudentsQuery from "@/repositories/persons/queries/getAllNonStudentsQuery";
import StudentForm from "@/components/students/studentForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import frFR from "@/lang/fr-FR";

export default async function Student({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const isEnabledParam =
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  let student;

  if (params.id !== "create") {
    student = await getStudentByIdQuery(Number(params.id));
  } else {
    student = null;
  }

  const countries = await getAllCountriesQuery();
  const colleges = await getAllCollegesQuery();
  const regimes = await getAllRegimesQuery();
  const contactTypes = await getAllContactTypesQuery();
  const nonStudents = await getAllNonStudentsQuery();

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/students/students?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="relative mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.students.student}</span>
        </div>
        <StudentForm
          studentData={student}
          action={action}
          countries={countries}
          colleges={colleges}
          regimes={regimes}
          contactTypes={contactTypes}
          nonStudents={nonStudents}
          pageIndexParam={pageIndexParam}
          pageSizeParam={pageSizeParam}
          urlParams={searchParams}
        />
      </div>
    </main>
  );
}
