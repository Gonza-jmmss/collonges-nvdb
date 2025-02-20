import getStudentByIdQuery from "@/repositories/students/queries/getStudentByIdQuery";
import getAllCountriesQuery from "@/repositories/countries/queries/getAllCountriesQuery";
import getAllCollegesQuery from "@/repositories/colleges/queries/getAllCollegesQuery";
import getAllRegimesQuery from "@/repositories/regimes/queries/getAllRegimesQuery";
import getAllContactTypesQuery from "@/repositories/personContactTypes/queries/getAllPersonContactTypesQuery";
import getAllNonStudentsQuery from "@/repositories/persons/queries/getAllNonStudentsQuery";
import StudentForm from "@/components/students/studentForm";
import frFR from "@/lang/fr-FR";

export default async function Student({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;

  let student;
  const action = searchParams.action?.replace(/"/g, "");

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
      />
    </div>
  );
}
