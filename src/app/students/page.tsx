import StudentsTable from "./studentsTable";
import { getAllStudentsQuery } from "@/repositories/students/queries/getAllStudentsQuery";
import enUS from "@/lang/en-US";

export default async function StudentsPage() {
  const t = enUS;

  const studentsQuery = new getAllStudentsQuery();
  const students = await studentsQuery.execute();

  return (
    <main className="">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.student.pageTitle}</span>
        </div>
        <StudentsTable studentsData={students} />
        {/* <pre>{JSON.stringify(students, null, 2)}</pre> */}
      </div>
    </main>
  );
}