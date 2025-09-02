"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import formatDate from "@/functions/formatDate";
import formatDateTime from "@/functions/formatDateTime";

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

  const contentDocumentInputRef = useRef<HTMLInputElement | null>(null);
  // Documents that already exist on server (from DB)
  const [originalDocs, setOriginalDocs] = useState<string[]>([]);
  // New documents selected (not yet uploaded)
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);

  const [homeworkSelectedDocs, setHomeworkSelectedDocs] = useState<
    Record<number, File[]>
  >({});

  const textBookDateParam = new Date(urlParams?.textbookDate as string);
  const levelIdParam =
    urlParams?.levelId !== null ? parseInt(urlParams?.levelId as string) : null;

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
      Documents:
        action !== "create" ? (courseContentData?.Documents ?? []) : null,
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
              Documents: homework.Documents,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      setIsPending(true);

      try {
        // Handle documents upload/deletion logic here
        await handleDocumentOperations(value);

        if (value.Homeworks) {
          for (let idx = 0; idx < value.Homeworks.length; idx++) {
            const homework = value.Homeworks[idx];
            if (homework.Documents !== null) {
              await handleHomeworkDocumentOperations(
                value,
                idx,
                homeworkSelectedDocs[idx],
                homework.Documents,
              );
            }
          }
        }

        // Then proceed with courseContent creation/update
        action === "create" && (await createCourseTextbook(value));
        action === "edit" && (await updateCourseTextbook(value));
      } catch (error) {
        console.error("Form submission error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `${error}`,
        });
        setIsPending(false);
      }
    },
  });

  const handleDocumentOperations = async (
    formData: CourseAttendanceFormData,
  ) => {
    const hasNewDocs = selectedDocs.length > 0;

    try {
      let uploadedDocs: string[] = [];

      // 1. Upload new documents (if any)
      if (hasNewDocs) {
        console.log("Uploading new documents...");
        const uploadFormData = new FormData();
        selectedDocs.forEach((file) => uploadFormData.append("files", file));

        const uploadResponse = await fetch("/api/documents/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Documents upload failed");
        }

        const { files } = await uploadResponse.json();
        uploadedDocs = files.map((f: any) => f.fileName);
      }

      // 2. Handle deletions (compare originalDocs vs current existingDocs state)
      const formDocs = form.getFieldValue("Documents") || [];
      const deletedDocs = formDocs.filter((doc) => !originalDocs.includes(doc));

      if (deletedDocs.length > 0) {
        console.log("Deleting docs:", deletedDocs);
        await fetch("/api/documents/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: deletedDocs }),
        });
      }

      // 3. Merge current existing docs with new uploads
      const updatedDocs = [...originalDocs, ...uploadedDocs];

      // 4. Update form data
      formData.Documents = updatedDocs;

      // 5. Update local state for next round
      // setOriginalDocs(updatedDocs);
      // setSelectedDocs([]); // clear new docs

      console.log("Documents updated:", updatedDocs);
    } catch (error) {
      console.error("Document operations error:", error);
      throw error;
    }
  };

  const handleHomeworkDocumentOperations = async (
    formData: CourseAttendanceFormData,
    homeworkIndex: number,
    selectedHomeworkDocs: File[],
    originalHomeworkDocs: string[],
  ) => {
    const hasNewDocs = selectedHomeworkDocs && selectedHomeworkDocs.length > 0;

    try {
      let uploadedDocs: string[] = [];

      if (hasNewDocs) {
        const uploadFormData = new FormData();
        selectedHomeworkDocs.forEach((file) =>
          uploadFormData.append("files", file),
        );

        const uploadResponse = await fetch("/api/documents/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) throw new Error("Homework docs upload failed");

        const { files } = await uploadResponse.json();
        uploadedDocs = files.map((f: any) => f.fileName);
      }

      // 2. Handle deletions
      const formDocs =
        form.getFieldValue(`Homeworks[${homeworkIndex}].Documents`) || [];
      const deletedDocs = originalHomeworkDocs.filter(
        (doc) => !formDocs.includes(doc),
      );

      if (deletedDocs.length > 0) {
        await fetch("/api/documents/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: deletedDocs }),
        });
      }

      // 3. Merge docs
      const updatedDocs = [...formDocs, ...uploadedDocs];
      if (formData.Homeworks)
        formData.Homeworks[homeworkIndex].Documents = updatedDocs;

      console.log(`Homework ${homeworkIndex} Documents updated:`, updatedDocs);
    } catch (err) {
      console.error("Homework document operations error:", err);
      throw err;
    }
  };

  const createCourseTextbook = async (formData: CourseAttendanceFormData) => {
    try {
      const response = await createCourseTextbookCommand(formData);

      if (!response) {
        throw new Error(`${t.courseTextbooks.notifications.createFailure}`);
      }
      toast({
        title: `${t.courseTextbooks.notifications.createSuccess}`,
        description: `${t.courseTextbooks.title} : ${courses.find((x) => x.CourseId === formData.CourseId)?.CourseCode} - ${courses.find((x) => x.CourseId === formData.CourseId)?.Name} | ${formatDate(formData.ContentDate)}}`,
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
        description: `${t.courseTextbooks.title} : ${courses.find((x) => x.CourseId === formData.CourseId)?.CourseCode} - ${courses.find((x) => x.CourseId === formData.CourseId)?.Name} | ${formatDate(formData.ContentDate)}}`,
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

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    setSelectedDocs((prev) => [...prev, ...newFiles]);

    // reset so the same file can be re-selected
    e.target.value = "";
  };

  // remove a new file
  const removeSelectedDoc = (index: number) => {
    setSelectedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  // remove an existing stored file (by name)
  const removeExistingDoc = (docName: string) => {
    setOriginalDocs((prev) => prev.filter((d) => d !== docName));
  };

  useEffect(() => {
    setOriginalDocs(form.getFieldValue("Documents") || []);
  }, []);

  const handleHomeworkDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    hwIndex: number,
  ) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    setHomeworkSelectedDocs((prev) => ({
      ...prev,
      [hwIndex]: [...(prev[hwIndex] || []), ...newFiles],
    }));

    e.target.value = "";
  };

  const removeHomeworkSelectedDoc = (hwIndex: number, fileIndex: number) => {
    setHomeworkSelectedDocs((prev) => ({
      ...prev,
      [hwIndex]: (prev[hwIndex] || []).filter((_, i) => i !== fileIndex),
    }));
  };

  const removeHomeworkExistingDoc = (hwIndex: number, docName: string) => {
    const currentDocs =
      form.getFieldValue(`Homeworks[${hwIndex}].Documents`) || [];
    form.setFieldValue(
      `Homeworks[${hwIndex}].Documents`,
      currentDocs.filter((d: string) => d !== docName),
    );
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
                console.log("validators", value);
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
                  data={parseEditorData(field.state.value)}
                  onChange={(newData: OutputData) => {
                    field.handleChange(stringifyEditorData(newData));
                  }}
                  editorBlock={`editorjs-content-${formatDateTime(form.getFieldValue("ReferenceDate"))}`}
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
        <div>
          {action === "view" ? (
            <>
              <span>{t.courseTextbooks.documents}</span>
            </>
          ) : (
            <>
              <input
                ref={contentDocumentInputRef}
                className="hidden"
                type="file"
                multiple
                onChange={handleDocumentChange}
              />
              <Button
                type="button"
                variant="ghost"
                className="flex space-x-2"
                onClick={() => contentDocumentInputRef.current?.click()}
              >
                <Icon name="MdCloudUpload" className="text-3xl" />
                <span>{t.courseTextbooks.documents}</span>
              </Button>
            </>
          )}
        </div>
        <div className="col-span-1 -mt-4 space-y-1 sm:col-span-2">
          <div className="flex flex-wrap space-x-3 space-y-3">
            <div />
            {originalDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 rounded-md border p-1"
              >
                <a
                  href={`/api/documents/${encodeURIComponent(doc)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {doc.slice(14)}
                </a>
                {action !== "view" && (
                  <Icon
                    name="MdClose"
                    className="text-lg hover:cursor-pointer hover:text-primary"
                    onClick={() => removeExistingDoc(doc)}
                  />
                )}
              </div>
            ))}
            {selectedDocs.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 rounded-md border p-1"
              >
                <span>{file.name}</span>
                {action !== "view" && (
                  <Icon
                    name="MdClose"
                    className="text-lg hover:cursor-pointer hover:text-primary"
                    onClick={() => removeSelectedDoc(idx)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
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
                          Documents: [],
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
                          <div>
                            {action === "view" ? (
                              <>
                                <span>{t.courseTextbooks.documents}</span>
                              </>
                            ) : (
                              <>
                                <input
                                  id={`homework-file-${index}`}
                                  className="hidden"
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    handleHomeworkDocumentChange(e, index)
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="flex space-x-2"
                                  onClick={() =>
                                    document
                                      .getElementById(`homework-file-${index}`)
                                      ?.click()
                                  }
                                >
                                  <Icon
                                    name="MdCloudUpload"
                                    className="text-3xl"
                                  />
                                  <span>{t.courseTextbooks.documents}</span>
                                </Button>
                              </>
                            )}
                          </div>
                          <div className="col-span-1 space-y-1 sm:col-span-2">
                            <div className="flex flex-wrap space-x-3 space-y-3">
                              <div />
                              {/* Existing docs from DB */}
                              {(homework.Documents || []).map((doc, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2 rounded-md border p-1"
                                >
                                  <a
                                    href={`/api/documents/${encodeURIComponent(doc)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    {doc.slice(14)}
                                  </a>
                                  {action !== "view" && (
                                    <Icon
                                      name="MdClose"
                                      className="text-lg hover:cursor-pointer hover:text-primary"
                                      onClick={() =>
                                        removeHomeworkExistingDoc(index, doc)
                                      }
                                    />
                                  )}
                                </div>
                              ))}

                              {/* New files not uploaded yet */}
                              {(homeworkSelectedDocs[index] || []).map(
                                (file, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center space-x-2 rounded-md border p-1"
                                  >
                                    <span>{file.name}</span>
                                    {action !== "view" && (
                                      <Icon
                                        name="MdClose"
                                        className="text-lg hover:cursor-pointer hover:text-primary"
                                        onClick={() =>
                                          removeHomeworkSelectedDoc(index, idx)
                                        }
                                      />
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
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
