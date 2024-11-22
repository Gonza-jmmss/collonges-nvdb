import { getQuarterNotesByStudentId } from "@/repositories/reports/queries/getQuarterNotesByStudentId";
import StudentNotesTable from "./studentNotesTable";
import IFLEStudentNotesPDF from "@/components/reports/ifleStudentNotesPDF";
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
            {studentNotes.StudentName}
          </span>
          <IFLEStudentNotesPDF studentNotesData={studentNotes} />
        </div>
        {/* <div>Sape</div> */}
        <StudentNotesTable studentNotesData={studentNotes.CourseNotes} />
        {/* <pre>{JSON.stringify(studentNotes.CourseNotes, null, 2)}</pre> */}
      </div>
    </main>
  );
}
