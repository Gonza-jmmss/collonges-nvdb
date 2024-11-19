import { getQuarterNotesByStudentId } from "@/repositories/reports/queries/getQuarterNotesByStudentId";
import enUS from "@/lang/en-US";

export default async function ifleStudentsNotesPage({
  params,
}: {
  params: { id: string };
}) {
  const t = enUS;

  const studentNotesQuery = new getQuarterNotesByStudentId();
  const studentNotes = await studentNotesQuery.execute(parseInt(params.id));

  return (
    <main className="mt-5 flex justify-center">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.reports.ifleStudentsNotes.title}
          </span>
        </div>
        {/* <div>Sape</div> */}
        <pre>{JSON.stringify(studentNotes, null, 2)}</pre>
      </div>
    </main>
  );
}
