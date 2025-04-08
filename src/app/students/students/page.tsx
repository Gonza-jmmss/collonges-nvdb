import StudentsTable from "./studentsTable";
import getAllStudentsQuery from "@/repositories/students/queries/getAllStudentsQuery";
import frFR from "@/lang/fr-FR";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const isEnabled = searchParams?.isEnabled === "false" ? false : true;

  const students = await getAllStudentsQuery({ IsEnabled: isEnabled });

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.students.pageTitle}</span>
        </div>
        <StudentsTable studentsData={students} urlParams={searchParams} />
        {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
      </div>
    </main>
  );
}
