import IFLEStudentsTable from "./ifleStudentsTable";
import getAllStudentsQuery from "@/repositories/students/queries/getAllStudentsQuery";
import frFR from "@/lang/fr-FR";

export default async function ifleStudentsNotesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const students = await getAllStudentsQuery({ IsEnabled: true });
  // const students = await studentsQuery.execute();

  const pageIndex = searchParams?.pageIndex
    ? parseInt(searchParams.pageIndex as string)
    : 0;

  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 10;

  return (
    <main className="mt-5 flex justify-center">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.reports.ifleStudentsNotes.title}
          </span>
        </div>
        <IFLEStudentsTable
          studentsData={students}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </div>
    </main>
  );
}
