"use client";

import { useState } from "react";
import createCourseTextbookCommand from "@/repositories/courseTextbook/commands/createCourseTextbookCommand";
import updateCourseTextbookCoommand from "@/repositories/courseTextbook/commands/updateCourseTextbookCoommand";
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
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { OutputData } from "@editorjs/editorjs";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type CourseAttendanceFormData = z.infer<typeof CourseContentSchema>;

export default function CourseTextbookForm({
  courseContentData,
  courses,
  levels,
  tearcherId,
  pageIndexParam,
  pageSizeParam,
  action,
  urlParams,
}: {
  courseContentData: CourseTextbookViewModel | null;
  courses: CourseViewModel[];
  levels: CurentLevelsViewModel[];
  tearcherId: number;
  pageIndexParam: number;
  pageSizeParam: number;
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [isPending, setIsPending] = useState(false);

  const textBookDateParam = new Date(urlParams?.textbookDate as string);
  const levelIdParam =
    urlParams?.levelId !== null ? parseInt(urlParams?.levelId as string) : null;
  const courseIdParam = parseInt(urlParams?.courseId as string);

  const dateNow = new Date();

  const form = useForm<CourseAttendanceFormData>({
    defaultValues: {
      CourseContentId:
        action !== "create" ? (courseContentData?.CourseContentId ?? 0) : 0,
      CourseId:
        action !== "create"
          ? (courseContentData?.CourseId ?? courses[0].CourseId)
          : courses[0].CourseId,
      UserId:
        action !== "create"
          ? (courseContentData?.UserId ?? tearcherId)
          : tearcherId,
      ContentDate:
        action !== "create"
          ? (courseContentData?.ContentDate ?? textBookDateParam)
          : textBookDateParam,
      Content: action !== "create" ? (courseContentData?.Content ?? "") : "",
      ReferenceDate:
        action !== "create"
          ? (courseContentData?.ReferenceDate ?? dateNow)
          : dateNow,
      Homeworks:
        action !== "create"
          ? (courseContentData?.Homeworks?.map((homework) => ({
              CourseHomeworkId: homework.CourseHomeworkId,
              CourseId: homework.CourseId,
              UserId: homework.UserId,
              HomeworkDate: homework.HomeworkDate,
              HomeworkDueDate: homework.HomeworkDueDate,
              Description: homework.Description,
              ReferenceDate: dateNow,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      setIsPending(true);
      action === "create" && createCourseTextbook(value);
      action === "edit" && updateCourseTextbook(value);
    },
  });

  const createCourseTextbook = async (formData: CourseAttendanceFormData) => {
    try {
      const response = await createCourseTextbookCommand(formData);

      if (!response) {
        throw new Error(`${t.courseTextbooks.notifications.createFailure}`);
      }
      toast({
        title: `${t.courseTextbooks.notifications.createSuccess}`,
        description: `${t.courseTextbooks.title} : ${courses.find((x) => x.CourseId === courseIdParam)?.CourseCode} - ${courses.find((x) => x.CourseId === courseIdParam)?.Name}}`,
      });

      router.push(
        `/courses/courseTextbooks?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&textbookDate=${textBookDateParam.toUTCString()}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.courseTextbooks.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateCourseTextbook = async (formData: CourseAttendanceFormData) => {
    try {
      const response = await updateCourseTextbookCoommand(formData);

      if (!response) {
        throw new Error(`${t.courseTextbooks.notifications.updateFailure}`);
      }
      toast({
        title: `${t.courseTextbooks.notifications.updateSuccess}`,
        description: `${t.courseTextbooks.title} : ${courses.find((x) => x.CourseId === courseIdParam)?.CourseCode} - ${courses.find((x) => x.CourseId === courseIdParam)?.Name}`,
      });

      router.push(
        `/courses/courseTextbooks?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&textbookDate=${textBookDateParam.toUTCString()}&referenceDate`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.courseTextbooks.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <div className="col-span-1 md:col-span-2">
          <div>{t.courseContents.form.course}</div>
          <div className="mt-1 flex flex-col space-y-5 md:flex-row md:space-x-3 md:space-y-0">
            <Combobox
              options={levels}
              textAttribute="Name"
              valueAttribute="LevelId"
              placeholder={t.courseContents.form.level}
              itemSelected={levels.find((x) => x.LevelId === levelIdParam)}
              setItemSelected={(x: CurentLevelsViewModel) => {
                handleUrlParameterChange("levelId", `${x ? x.LevelId : null}`);
              }}
              disabled={action === "view"}
            />
            <form.Field
              name="CourseId"
              validators={{
                onSubmitAsync: (value) => {
                  if (value === null || value === undefined) {
                    return t.courseContents.validations.courseValidation;
                  }
                  return z.number().min(0).safeParse(value.value).success
                    ? undefined
                    : t.courseContents.validations.courseValidation;
                },
              }}
              children={(field) => (
                <>
                  <Combobox
                    options={courses}
                    textAttribute={["CourseCode", "Name"]}
                    valueAttribute="CourseId"
                    placeholder={t.courseContents.form.course}
                    itemSelected={courses.find(
                      (x) => x.CourseId === field.state.value,
                    )}
                    setItemSelected={(x: CourseViewModel) => {
                      field.handleChange(x && x.CourseId);
                      // handleUrlParameterChange("courseId", `${x.CourseId}`);
                      form
                        .getFieldValue("Homeworks")
                        ?.map((devoir, index) =>
                          form.setFieldValue(
                            `Homeworks[${index}].CourseId`,
                            x.CourseId,
                          ),
                        );
                    }}
                    disabled={action === "view"}
                    notClearable
                  />
                  <div className="text-xs text-red-500">
                    {field.state.meta.errors
                      ? field.state.meta.errors.join(", ")
                      : null}
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div className="col-span-1 space-y-1">
          <form.Field
            name="ContentDate"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.courseContents.validations.contentDateValidation;
                }
                return z.date().safeParse(value.value).success
                  ? undefined
                  : t.courseContents.validations.contentDateValidation;
              },
            }}
            children={(field) => (
              <>
                <span>{t.courseContents.form.contentDate}</span>

                <CalendarInput
                  dateValue={field.state.value}
                  setDateValue={(x: Date) => {
                    field.handleChange(x);
                    form
                      .getFieldValue("Homeworks")
                      ?.map((devoir, index) =>
                        form.setFieldValue(
                          `Homeworks[${index}].HomeworkDate`,
                          x,
                        ),
                      );
                  }}
                  disabled={action === "view"}
                />
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </>
            )}
          />
        </div>
        <div className="col-span-1 space-y-1 sm:col-span-2">
          <form.Field
            name="Content"
            validators={{
              onSubmitAsync: (value) => {
                if (
                  !value ||
                  value.value === null ||
                  value.value === undefined ||
                  value.value.trim() === ""
                ) {
                  return t.courseContents.validations.contentValidation;
                }

                // Validate that it's valid JSON if not empty
                try {
                  if (value.value.trim() !== "") {
                    JSON.parse(value.value);
                  }
                  return undefined;
                } catch (error) {
                  return t.courseContents.validations.contentFormatValidation;
                }
              },
            }}
            children={(field) => (
              <>
                <span>{t.courseContents.form.content}</span>
                <TextEditor
                  key={`editor-${form.getFieldValue("ReferenceDate")}`}
                  data={parseEditorData(field.state.value)}
                  onChange={(newData: OutputData) => {
                    field.handleChange(stringifyEditorData(newData));
                  }}
                  editorBlock={"editorjs-content"}
                  placeholder={t.courseContents.textEditor.placeholder}
                  disabled={action === "view"}
                />
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </>
            )}
          />
        </div>
        {/* <pre>{JSON.stringify(form.getFieldValue("Content"))}</pre> */}
        <div className="col-span-1 space-y-1 md:col-span-2">
          <form.Field
            name="Homeworks"
            mode="array"
            children={(field) => (
              <>
                {action !== "view" && (
                  <div className="col-span-1 flex space-x-5 pb-2 md:col-span-2">
                    <Button
                      type="button"
                      variant={"outlineColored"}
                      onClick={() =>
                        field.pushValue({
                          CourseHomeworkId: null,
                          CourseId: form.getFieldValue("CourseId"),
                          UserId: tearcherId,
                          HomeworkDate: form.getFieldValue("ContentDate"),
                          HomeworkDueDate: new Date(),
                          Description: "",
                          ReferenceDate: form.getFieldValue("ReferenceDate"),
                        })
                      }
                    >
                      {t.courseHomeworks.form.addHomework}
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3">
                  {field.state.value?.map((homework, index) => (
                    <div
                      key={`${index}${homework.HomeworkDueDate}`}
                      className="grid grid-cols-2 rounded-md border border-foreground/10 bg-muted/50 p-2"
                    >
                      <div className="col-span-2 flex justify-between space-x-3">
                        <span className="text-xl font-semibold">
                          {`${t.courseHomeworks.form.homework}`}
                        </span>
                        {action !== "view" && (
                          <>
                            <Button
                              type="button"
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => field.removeValue(index)}
                            >
                              <Icon name="MdClose" className="text-xl" />
                            </Button>
                          </>
                        )}
                      </div>
                      {field.state.value && field.state.value.length > 0 && (
                        <>
                          <div className="col-span-1 space-y-1">
                            <form.Field
                              name={`Homeworks[${index}].HomeworkDueDate`}
                              validators={{
                                onSubmitAsync: (value) => {
                                  if (value === null || value === undefined) {
                                    return t.courseHomeworks.validations
                                      .homeworkDateValidation;
                                  }
                                  return z.date().safeParse(value.value).success
                                    ? undefined
                                    : t.courseHomeworks.validations
                                        .homeworkDateValidation;
                                },
                              }}
                              children={(field) => (
                                <>
                                  <span>
                                    {t.courseHomeworks.form.homeworkDueDate}
                                  </span>

                                  <CalendarInput
                                    dateValue={field.state.value}
                                    setDateValue={(x: Date) => {
                                      field.handleChange(x);
                                    }}
                                    disabled={action === "view"}
                                  />
                                  <div className="text-xs text-red-500">
                                    {field.state.meta.errors
                                      ? field.state.meta.errors.join(", ")
                                      : null}
                                  </div>
                                </>
                              )}
                            />
                          </div>
                          <div className="col-span-1 space-y-1 sm:col-span-2">
                            <form.Field
                              name={`Homeworks[${index}].Description`}
                              validators={{
                                onSubmitAsync: (value) => {
                                  if (
                                    !value ||
                                    value.value === null ||
                                    value.value === undefined ||
                                    value.value.trim() === ""
                                  ) {
                                    return t.courseHomeworks.validations
                                      .descriptionValidation;
                                  }

                                  // Validate that it's valid JSON if not empty
                                  try {
                                    if (value.value.trim() !== "") {
                                      JSON.parse(value.value);
                                    }
                                    return undefined;
                                  } catch (error) {
                                    return t.courseHomeworks.validations
                                      .descriptionValidation;
                                  }
                                },
                              }}
                              children={(field) => (
                                <>
                                  <span>
                                    {t.courseHomeworks.form.description}
                                  </span>
                                  <TextEditor
                                    data={parseEditorData(field.state.value)}
                                    onChange={(newData: OutputData) => {
                                      field.handleChange(
                                        stringifyEditorData(newData),
                                      );
                                    }}
                                    editorBlock={`editorjs-homework${index}`}
                                    placeholder={
                                      t.courseHomeworks.textEditor.placeholder
                                    }
                                    disabled={action === "view"}
                                  />
                                  <div className="text-xs text-red-500">
                                    {field.state.meta.errors
                                      ? field.state.meta.errors.join(", ")
                                      : null}
                                  </div>
                                </>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </>
            )}
          />
        </div>
        {/* <pre>{JSON.stringify(ByCouse, null, 2)}</pre> */}
        <div className="col-span-1 md:col-span-2">
          {action !== "view" ? (
            <div className="flex justify-center space-x-3">
              <Button
                type="button"
                variant={"secondary"}
                className="w-[30%]"
                onClick={() =>
                  router.push(
                    `/courses/courseTextbooks?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&textbookDate=${textBookDateParam.toUTCString()}`,
                  )
                }
              >
                {t.shared.cancel}
              </Button>
              <Button
                type="submit"
                variant={"default"}
                className="w-[30%]"
                disabled={isPending}
              >
                {t.shared.save}
              </Button>
            </div>
          ) : (
            <div className="flex justify-center space-x-3">
              <Button
                type="button"
                variant={"secondary"}
                className="w-[30%]"
                onClick={() =>
                  router.push(
                    `/courses/courseTextbooks?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&textbookDate=${textBookDateParam.toUTCString()}`,
                  )
                }
              >
                {t.shared.cancel}
              </Button>
            </div>
          )}
        </div>
        {/* <pre>{JSON.stringify(CoursesData, null, 2)}</pre> */}
      </form>
    </>
  );
}
