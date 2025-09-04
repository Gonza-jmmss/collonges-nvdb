"use client";

import { useState, useMemo } from "react";
import deleteCourseTextbookCoommand from "@/repositories/courseTextbook/commands/deleteCourseTextbookCommand";
import {
  CourseContentsByDayViewModel,
  CourseTextbooksByDay,
} from "@/repositories/courseTextbook/courseTextbookViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import DeleteModal from "@/components/common/deleteModal";
import Icon from "@/components/common/icon";
import CalendarInput from "@/components/common/calendarInput";
import { Button } from "@/components/ui/button";
import formatDate from "@/functions/formatDate";
import formatDateTime from "@/functions/formatDateTime";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import frFR from "@/lang/fr-FR";

export default function CourseTextbookTable({
  courseTextbooksData,
  textbookDateSelected,
  pageIndex,
  pageSize,
  urlParams,
}: {
  courseTextbooksData: CourseContentsByDayViewModel[];
  textbookDateSelected: Date;
  pageIndex: number;
  pageSize: number;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();

  const getPageIndexParam = searchParams.get("pageIndex");
  const getPageSizeParam = searchParams.get("pageSize");

  const [openModal, setOpenModal] = useState(false);
  const [textbookToDelete, setTextbookToDelete] =
    useState<CourseTextbooksByDay | null>();

  const closeModal = () => {
    setOpenModal(false);
    setTextbookToDelete(null);
  };

  const columns = useMemo<ColumnDef<CourseContentsByDayViewModel, any>[]>(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => <Header text="" />,
        cell: ({ row }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {row.original.CourseTextbooks.length > 0 && row.getCanExpand() ? (
              <div onClick={row.getToggleExpandedHandler()}>
                {row.getIsExpanded() ? (
                  <Icon name="MdArrowDownward" className="cursor-pointer" />
                ) : (
                  <Icon name="MdArrowForward" className="cursor-pointer" />
                )}
              </div>
            ) : (
              <Icon name="MdHorizontalRule" />
            )}
          </div>
        ),
        size: 5,
      },
      {
        accessorKey: "LevelName",
        id: "LevelName",
        header: () => <Header text={t.courseTextbooks.columns.levelName} />,
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const columnsExtended = useMemo<ColumnDef<CourseTextbooksByDay, any>[]>(
    () => [
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header text={t.courseTextbooks.columnsExtended.courseCode} />
        ),
        filterFn: "equalsString",
        cell: (x) =>
          x.getValue().includes("/") ? x.getValue().slice(0, -2) : x.getValue(),
        size: 100,
      },
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => (
          <Header text={t.courseTextbooks.columnsExtended.courseName} />
        ),
        filterFn: "equalsString",
        size: 300,
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => (
          <Header text={t.courseTextbooks.columnsExtended.userName} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.shared.actions} />,
        size: 20,
        cell: ({ row }) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon
              name="MdEdit"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/courses/courseTextbooks/${row.original.CourseContentId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.original.CourseId}&textbookDate=${row.original.ContentDate.toUTCString()}&referenceDate=${row.original.ReferenceDate.toUTCString()}`,
                )
              }
            />
            <Icon
              name={"MdDelete"}
              className={
                "cursor-pointer text-xl text-primary hover:text-destructive"
              }
              onClick={() => {
                setOpenModal(true);
                setTextbookToDelete(row.original);
              }}
            />
          </div>
        ),
      },
    ],
    [getPageIndexParam, getPageSizeParam],
  );

  const deleteCourseTextbook = async (
    courseTextbook: CourseTextbooksByDay | null,
  ) => {
    console.log("courseTextbook", courseTextbook);
    // try {
    //   if (courseTextbook) {
    //     const courseTextbookToDelete = {
    //       CourseId: courseTextbook.CourseId,
    //       ReferenceDate: courseTextbook.ReferenceDate,
    //     };
    //     const response = await deleteCourseTextbookCoommand(
    //       courseTextbookToDelete,
    //     );

    //     if (!response) {
    //       throw new Error(`${t.courseTextbooks.notifications.deleteFailure}`);
    //     }
    //     toast({
    //       title: `${t.courseTextbooks.notifications.deleteSuccess}`,
    //       description: `${t.courseTextbooks.title} : ${textbookToDelete && `${textbookToDelete.CourseCode} ${textbookToDelete.CourseName} - ${formatDate(textbookToDelete.ContentDate)}`}`,
    //     });
    //     router.refresh();
    //     closeModal();
    //   }
    // } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: `${t.courseTextbooks.notifications.deleteError}`,
    //     description: `${error}`,
    //   });
    // }
  };

  // const handleHomeworkDocumentOperations = async (
  //   formData: CourseAttendanceFormData,
  //   homeworkIndex: number,
  //   selectedHomeworkDocs: File[],
  //   originalHomeworkDocs: string[],
  // ) => {
  //   const hasNewDocs = selectedHomeworkDocs && selectedHomeworkDocs.length > 0;

  //   try {
  //     let uploadedDocs: string[] = [];

  //     if (hasNewDocs) {
  //       const uploadFormData = new FormData();
  //       selectedHomeworkDocs.forEach((file) =>
  //         uploadFormData.append("files", file),
  //       );

  //       const uploadResponse = await fetch("/api/documents/upload", {
  //         method: "POST",
  //         body: uploadFormData,
  //       });

  //       if (!uploadResponse.ok) throw new Error("Homework docs upload failed");

  //       const { files } = await uploadResponse.json();
  //       uploadedDocs = files.map((f: any) => f.fileName);
  //     }

  //     // 2. Handle deletions
  //     const formDocs =
  //       form.getFieldValue(`Homeworks[${homeworkIndex}].Documents`) || [];
  //     const deletedDocs = originalHomeworkDocs.filter(
  //       (doc) => !formDocs.includes(doc),
  //     );

  //     if (deletedDocs.length > 0) {
  //       await fetch("/api/documents/delete", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ files: deletedDocs }),
  //       });
  //     }

  //     // 3. Merge docs
  //     const updatedDocs = [...formDocs, ...uploadedDocs];
  //     if (formData.Homeworks)
  //       formData.Homeworks[homeworkIndex].Documents = updatedDocs;

  //     console.log(`Homework ${homeworkIndex} Documents updated:`, updatedDocs);
  //   } catch (err) {
  //     console.error("Homework document operations error:", err);
  //     throw err;
  //   }
  // };

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  const subtractDays = (date: Date, days: number) => {
    date.setDate(date.getDate() - days);
    return date;
  };

  return (
    <div>
      <div className="mt-5">
        <div className="flex items-center justify-between space-x-5">
          <div className="flex justify-end space-x-3 overflow-hidden">
            {[...Array(7)].map((_, i) => (
              <Button
                key={i}
                variant={
                  formatDate(subtractDays(new Date(), 6 - i)) ===
                  formatDate(textbookDateSelected)
                    ? "default"
                    : "outlineColored"
                }
                className=" "
                onClick={() =>
                  handleUrlParameterChange(
                    "textbookDate",
                    `${subtractDays(new Date(), 6 - i).toISOString()}`,
                  )
                }
              >
                <span>{formatDate(subtractDays(new Date(), 6 - i))}</span>
              </Button>
            ))}
            <div className="w-auto min-w-40">
              <CalendarInput
                variant="outlineColored"
                dateValue={textbookDateSelected}
                setDateValue={(x: Date) => {
                  handleUrlParameterChange("textbookDate", `${new Date(x)}`);
                }}
              />
            </div>
          </div>
          <Button
            variant="outlineColored"
            onClick={() =>
              router.push(
                `/courses/courseTextbooks/create?action="create"&pageIndex=${pageIndex}&pageSize=${pageSize}&textbookDate=${textbookDateSelected.toUTCString()}`,
              )
            }
          >
            <span>{t.courseTextbooks.create}</span>
          </Button>
        </div>
        <Table
          columns={columns}
          data={courseTextbooksData}
          className=""
          pageIndexParam={pageIndex}
          pageSizeParam={pageSize}
          expandable
          expandedContent={(row) => (
            <Table
              columns={columnsExtended}
              data={row.CourseTextbooks}
              onRowClick={(row) =>
                router.push(
                  `/courses/courseTextbooks/${row.CourseContentId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.CourseId}&textbookDate=${row.ContentDate.toUTCString()}&referenceDate=${row.ReferenceDate.toUTCString()}`,
                )
              }
              minimalMode
              noBorders
            />
          )}
        />
        <DeleteModal
          openModal={openModal}
          closeModal={closeModal}
          titleText={t.courseTextbooks.deleteModal.title}
          descriptionText={t.courseTextbooks.deleteModal.description}
          deletefunction={() => deleteCourseTextbook(textbookToDelete || null)}
        />
      </div>
    </div>
  );
}
