"use client";

import { useEffect } from "react";
import { StudentCourseHomeworksByDayViewModel } from "@/repositories/courseTextbook/courseTextbookViewModel";
import TextEditor from "@/components/common/textEditor";
import Icon from "@/components/common/icon";
import formatDate from "@/functions/formatDate";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import frFR from "@/lang/fr-FR";

export default function StudentCourseHomeworksVisualization({
  courseHomeworksData,
  tabValue,
}: {
  courseHomeworksData: StudentCourseHomeworksByDayViewModel[];
  tabValue: string;
}) {
  const t = frFR;
  const updateQuery = useUpdateQuery();

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  useEffect(() => {
    handleUrlParameterChange("tab", `${tabValue}`);
    // console.log("tabs", tabValue);
  }, [tabValue]);

  return (
    <>
      {/* Desktop */}
      <div className="flex flex-col space-y-3">
        <div className="mt-1 rounded-md border bg-muted/50 p-1 shadow-md">
          <span className="text-sm font-semibold sm:text-base">{`${t.studentHomeworks.quantity}: `}</span>
          <span>{`${courseHomeworksData.length}`}</span>
        </div>
        {courseHomeworksData.map((homework) => (
          <div className="rounded-md border bg-muted/50 p-3 shadow-md">
            <div className="flex space-x-2">
              <span className="text-sm font-semibold sm:text-base">
                {t.studentHomeworks.card.course}:
              </span>
              <span className="text-sm sm:text-base">{`${homework.CourseCode} - ${homework.CourseName}`}</span>
            </div>
            <div className="flex space-x-2">
              <span className="text-sm font-semibold sm:text-base">
                {t.studentHomeworks.card.homeworkDate}:
              </span>
              <span className="text-sm sm:text-base">
                {formatDate(homework.HomeworkDate)}
              </span>
              <span className="text-sm font-semibold sm:text-base">
                {t.studentHomeworks.card.userName}:
              </span>
              <span className="text-sm sm:text-base">{homework.UserName}</span>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-sm font-semibold sm:text-base">
                {t.studentHomeworks.card.description}:
              </span>
              <div className="w-full">
                <TextEditor
                  value={homework.Description}
                  onChange={() => {}}
                  placeholder={t.courseContents.textEditor.placeholder}
                  disabled={true}
                />
              </div>
            </div>
            {homework.Documents.length > 0 && (
              <div className="mt-2 flex flex-col">
                <span className="text-sm font-semibold sm:text-base">
                  {t.studentHomeworks.card.documents}:
                </span>
                <div className="flex flex-wrap space-x-3 space-y-3">
                  <div />
                  {homework.Documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={`/api/documents/${encodeURIComponent(doc)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 overflow-hidden rounded-md border p-1 hover:border-primary"
                      download
                    >
                      <Icon name="MdSimCardDownload" className="text-lg" />
                      <span>{doc.slice(14)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {/* <pre>{JSON.stringify(courseHomeworksData, null, 2)}</pre> */}
      </div>
      {/* Mobile */}
      {/* <div className="flex flex-col space-y-2 sm:hidden">
        <div className="rounded-md border bg-muted/50 p-1 shadow-md">
          <span className="text-sm font-semibold">{`${t.studentHomeworks.quantity}: `}</span>
          <span className="text-sm">{`${courseHomeworksData.length}`}</span>
        </div>
        {courseHomeworksData.map((homework) => (
          <div className="rounded-md border bg-muted/50 p-3 shadow-md">
            <div className="flex space-x-2">
              <span className="text-sm font-semibold">
                {t.studentHomeworks.card.course}:
              </span>
              <span className="text-sm">{`${homework.CourseCode} - ${homework.CourseName}`}</span>
            </div>
            <div className="flex space-x-2">
              <span className="text-sm font-semibold">
                {t.studentHomeworks.card.homeworkDate}:
              </span>
              <span className="text-sm">
                {formatDate(homework.HomeworkDueDate)}
              </span>
            </div>
            <div className="flex space-x-2">
              <span className="text-sm font-semibold">
                {t.studentHomeworks.card.userName}:
              </span>
              <span className="text-sm">{homework.UserName}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-semibold">
                {t.studentHomeworks.card.description}:
              </span>
              <div className="w-full">
                <TextEditor
                  data={parseEditorData(homework.Description)}
                  onChange={() => {}}
                  editorBlock={`editorjs-homework${homework.CourseHomeworkId}`}
                  placeholder={t.courseContents.textEditor.placeholder}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        ))}
      </div> */}
      {/* <pre>{JSON.stringify(attendancesData, null, 2)}</pre> */}
    </>
  );
}
