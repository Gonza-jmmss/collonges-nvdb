"use client";

import { CourseTextbookViewModel } from "@/repositories/courseTextbook/courseTextbookViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { CurentLevelsViewModel } from "@/repositories/levels/levelsViewModel";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import CalendarInput from "@/components/common/calendarInput";
import Icon from "@/components/common/icon";
import TextEditor from "@/components/common/textEditor";
import formatDate from "@/functions/formatDate";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function CourseContentVisualization({
  courseContentData,
  courses,
  urlParams,
}: {
  courseContentData: CourseTextbookViewModel | null;
  courses: CourseViewModel[];
  levels: CurentLevelsViewModel[];
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();

  const textBookDateParam = new Date(urlParams?.textbookDate as string);

  return (
    <>
      {/* Desktop */}
      <div className="flex w-full">
        <div className="mt-3 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div>{t.studentCourseContent.content.course}</div>
            <div className="mt-1 flex flex-col space-y-5 md:flex-row md:space-x-3 md:space-y-0">
              <Combobox
                options={courses}
                textAttribute={["CourseCode", "Name"]}
                valueAttribute="CourseId"
                placeholder={t.studentCourseContent.content.course}
                itemSelected={courses.find(
                  (x) => x.CourseId === courseContentData?.CourseId,
                )}
                setItemSelected={(x: CourseViewModel) => {}}
                disabled={true}
                notClearable
              />
            </div>
          </div>
          <div className="col-span-1 space-y-1">
            <span>{t.studentCourseContent.content.contentDate}</span>
            <CalendarInput
              dateValue={courseContentData?.ContentDate}
              setDateValue={(x: Date) => {}}
              disabled={true}
            />
          </div>
          <div className="col-span-1 space-y-1 sm:col-span-2">
            <span>{t.studentCourseContent.content.content}</span>
            <TextEditor
              value={courseContentData?.Content || ""}
              onChange={() => {}}
              placeholder={t.courseContents.textEditor.placeholder}
              disabled={true}
            />
          </div>
          <div className="col-span-1 space-y-1 sm:col-span-2">
            {courseContentData && courseContentData.Documents.length > 0 && (
              <div className="mt-2 flex flex-col">
                <span className="text-sm font-semibold sm:text-base">
                  {t.studentCourseContent.content.documents}:
                </span>
                <div className="flex flex-wrap space-x-3 space-y-3">
                  <div />
                  {courseContentData.Documents.map((doc, idx) => (
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
          {/* Homeworks */}
          {courseContentData &&
            courseContentData.Homeworks.map((homework) => (
              <div className="col-span-1 space-y-1 sm:col-span-2">
                <div className="border-t pb-2" />
                <span className="text-lg font-medium">
                  {t.studentCourseContent.homeworks}:
                </span>
                <div className="rounded-md border bg-muted/50 p-3 shadow-md">
                  <div className="flex space-x-2">
                    <span className="text-sm font-semibold sm:text-base">
                      {t.studentCourseContent.homework.homeworkDueDate}:
                    </span>
                    <span className="text-sm sm:text-base">
                      {formatDate(homework.HomeworkDueDate)}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <span className="text-sm font-semibold sm:text-base">
                      {t.studentCourseContent.homework.description}:
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
                        {t.studentCourseContent.homework.documents}:
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
                            <Icon
                              name="MdSimCardDownload"
                              className="text-lg"
                            />
                            <span>{doc.slice(14)}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-center space-x-3">
              <Button
                type="button"
                variant={"secondary"}
                className="w-[30%]"
                onClick={() =>
                  router.push(
                    `/studentHome/textbooks?textbookDate=${textBookDateParam.toUTCString()}`,
                  )
                }
              >
                {t.shared.cancel}
              </Button>
            </div>
          </div>
          {/* <pre>{JSON.stringify(courseContentData, null, 2)}</pre> */}
        </div>
      </div>
      {/* Mobile */}
      {/* <div className="flex flex-col space-y-2 sm:hidden">
        <div className="flex flex-col space-y-2">
          <div>{t.courseContents.form.course}</div>
          <div className="mt-1 flex flex-col space-y-5 md:flex-row md:space-x-3 md:space-y-0">
            <Combobox
              options={courses}
              textAttribute={["CourseCode", "Name"]}
              valueAttribute="CourseId"
              placeholder={t.courseContents.form.course}
              itemSelected={courses.find(
                (x) => x.CourseId === courseContentData?.CourseId,
              )}
              setItemSelected={(x: CourseViewModel) => {}}
              disabled={true}
              notClearable
            />
          </div>
          <div className="flex flex-col space-y-1">
            <span>{t.courseContents.form.contentDate}</span>
            <CalendarInput
              dateValue={courseContentData?.ContentDate}
              setDateValue={(x: Date) => {}}
              disabled={true}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <span>{t.courseContents.form.content}</span>
            <TextEditor
              data={parseEditorData(courseContentData?.Content)}
              onChange={() => {}}
              editorBlock={`editorjs-content${courseContentData?.CourseContentId}`}
              placeholder={t.courseContents.textEditor.placeholder}
              disabled={true}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-center space-x-3">
          <Button
            type="button"
            variant={"secondary"}
            className="w-[30%]"
            onClick={() =>
              router.push(
                `/studentHome/textbooks?textbookDate=${textBookDateParam.toUTCString()}`,
              )
            }
          >
            {t.shared.cancel}
          </Button>
        </div>
      </div> */}
    </>
  );
}
