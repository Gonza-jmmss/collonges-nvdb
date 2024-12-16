"use client";

import StudentNotesTable from "@/app/reports/ifleStudentsNotes/[id]/studentNotesTable";
import { QuarterNotesResultViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import formatDate from "@/functions/formatDate";
import frFR from "@/lang/fr-FR";

export default function AmericanTranscript({
  studentNotesData,
}: {
  studentNotesData: QuarterNotesResultViewModel;
}) {
  const t = frFR;
  return (
    <div>
      <div className="mt-5 rounded-md border bg-muted/50 p-3">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.studentName}
              </span>
              <span>{`${studentNotesData.StudentLastName}, ${studentNotesData.StudentFirstName}`}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.dbaseId}
              </span>
              <span>{studentNotesData.DBaseCode}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.birthdate}
              </span>
              <span>
                {formatDate(studentNotesData.Birthdate || new Date())}
              </span>
              <span>
                {t.reports.ifleStudentsNotes.dpfEnglish.data.dateFormat}
              </span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.issueDate}
              </span>
              <span>{formatDate(new Date())}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.place}
              </span>
              <span>{studentNotesData.BirthCity}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.issuedTo}
              </span>
              <span>{studentNotesData.CollegeAbbreviation}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.country}
              </span>
              <span>{studentNotesData.BirthCountryEn}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">
                {t.reports.ifleStudentsNotes.dpfEnglish.data.credits}
              </span>
              <span>{"UNIVERSITARY"}</span>
            </div>
          </div>
        </div>
        <StudentNotesTable
          studentNotesData={studentNotesData.CourseNotes}
          transcriptType="american"
        />
        {/* <pre>{JSON.stringify(studentNotesData, null, 2)}</pre> */}
      </div>
    </div>
  );
}
