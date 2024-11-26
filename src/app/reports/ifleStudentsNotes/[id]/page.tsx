import { getQuarterNotesByStudentId } from "@/repositories/reports/queries/getQuarterNotesByStudentId";
import StudentNotesTable from "./studentNotesTable";
import IFLEStudentNotesPDF from "@/components/reports/ifleStudentNotesPDF";
import formatDate from "@/functions/formatDate";
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
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold">{`${t.reports.ifleStudentsNotes.titlePage} : `}</span>
            <span className="text-xl">{studentNotes.StudentName}</span>
          </div>
          <IFLEStudentNotesPDF studentNotesData={studentNotes} />
        </div>
        <div className="mt-5 rounded-md border p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between space-x-3">
              <div className="flex space-x-2">
                <span className="font-semibold">
                  {t.reports.ifleStudentsNotes.dpf.dataEnglish.studentName}
                </span>
                <span>{studentNotes.StudentName}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-semibold">
                  {t.reports.ifleStudentsNotes.dpf.dataEnglish.dbaseId}
                </span>
                <span>{studentNotes.DBaseCode}</span>
              </div>
            </div>
            <div className="flex justify-between space-x-3">
              <div className="flex space-x-2">
                <span className="font-semibold">
                  {t.reports.ifleStudentsNotes.dpf.dataEnglish.birthdate}
                </span>
                <span>{formatDate(studentNotes.Birthdate || new Date())}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-semibold">
                  {t.reports.ifleStudentsNotes.dpf.dataEnglish.emitionDate}
                </span>
                <span>{formatDate(new Date())}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpf.dataEnglish.place}
              </span>
              <span>{studentNotes.BirthCity}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpf.dataEnglish.country}
              </span>
              <span>{studentNotes.BirthCountry}</span>
            </div>
          </div>
          <StudentNotesTable studentNotesData={studentNotes.CourseNotes} />
        </div>
        {/* <pre>{JSON.stringify(studentNotes.CourseNotes, null, 2)}</pre> */}
      </div>
    </main>
  );
}
