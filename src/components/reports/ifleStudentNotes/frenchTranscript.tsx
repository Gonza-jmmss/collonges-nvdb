import StudentNotesTable from "@/app/reports/ifleStudentsNotes/[id]/studentNotesTable";
import { QuarterNotesResultViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import formatDate from "@/functions/formatDate";
import frFR from "@/lang/fr-FR";

export default function FrenchTranscript({
  studentNotesData,
}: {
  studentNotesData: QuarterNotesResultViewModel;
}) {
  const t = frFR;
  return (
    <div>
      <div className="mt-5 rounded-md border bg-muted/50 p-3">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between space-x-3">
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfFrench.data.studentName}
              </span>
              <span>{`${studentNotesData.StudentLastName}, ${studentNotesData.StudentFirstName}`}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfFrench.data.dbaseId}
              </span>
              <span>{studentNotesData.DBaseCode}</span>
            </div>
          </div>
          <div className="flex justify-between space-x-3">
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfFrench.data.birthdate}
              </span>
              <span>
                {formatDate(studentNotesData.Birthdate || new Date())}
              </span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfFrench.data.issueDate}
              </span>
              <span>{formatDate(new Date())}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="font-semibold">
              {t.reports.ifleStudentsNotes.dpfFrench.data.place}
            </span>
            <span>{studentNotesData.BirthCity}</span>
          </div>
          <div className="flex space-x-2">
            <span className="font-semibold">
              {t.reports.ifleStudentsNotes.dpfFrench.data.country}
            </span>
            <span>{studentNotesData.BirthCountryFr}</span>
          </div>
        </div>
        <StudentNotesTable
          studentNotesData={studentNotesData.CourseNotes}
          transcriptType="french"
        />
      </div>
    </div>
  );
}
