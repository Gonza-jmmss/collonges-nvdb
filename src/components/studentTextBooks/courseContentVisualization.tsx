"use client";

import { useState } from "react";
import { CourseTextbookViewModel } from "@/repositories/courseTextbook/courseTextbookViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { CurentLevelsViewModel } from "@/repositories/levels/levelsViewModel";
import { CourseContentSchema } from "@/zodSchemas/courseTextbookSchema";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import CalendarInput from "@/components/common/calendarInput";
import Icon from "@/components/common/icon";
import TextEditor from "@/components/common/textEditor";
import {
  parseEditorData,
  stringifyEditorData,
} from "@/functions/textEditorConvertions";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function CourseContentVisualization({
  courseContentData,
  courses,
  levels,
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
          <div className="col-span-1 md:col-span-2">
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
          </div>
          <div className="col-span-1 space-y-1">
            <span>{t.courseContents.form.contentDate}</span>
            <CalendarInput
              dateValue={courseContentData?.ContentDate}
              setDateValue={(x: Date) => {}}
              disabled={true}
            />
          </div>
          <div className="col-span-1 space-y-1 sm:col-span-2">
            <span>{t.courseContents.form.content}</span>
            <TextEditor
              data={parseEditorData(courseContentData?.Content)}
              onChange={() => {}}
              editorBlock={`editorjs-content`}
              placeholder={t.courseContents.textEditor.placeholder}
              disabled={true}
            />
          </div>
          {/* <pre>{JSON.stringify(ByCouse, null, 2)}</pre> */}
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
