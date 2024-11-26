import IFLEStudentsTable from "./ifleStudentsTable";
import { getAllStudentsQuery } from "@/repositories/students/queries/getAllStudentsQuery";
import enUS from "@/lang/en-US";

export default async function ifleStudentsNotesPage() {
  const t = enUS;

  const studentsQuery = new getAllStudentsQuery();
  const students = await studentsQuery.execute();

  return (
    <main className="mt-5 flex justify-center">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.reports.ifleStudentsNotes.title}
          </span>
        </div>
        <IFLEStudentsTable studentsData={students} />
        {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
      </div>
    </main>
  );
}