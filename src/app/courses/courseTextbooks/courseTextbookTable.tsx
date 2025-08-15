"use client";

import { useState, useMemo } from "react";
import deleteCourseTextbookCoommand from "@/repositories/courseTextbook/commands/deleteCourseTextbookCommand";
import { CourseContentsViewModel } from "@/repositories/courseTextbook/courseTextbookViewModel";
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
  courseIdSelected,
  pageIndex,
  pageSize,
  urlParams,
}: {
  courseTextbooksData: CourseContentsViewModel[];
  textbookDateSelected: Date;
  courseIdSelected: number;
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
    useState<CourseContentsViewModel | null>();

  const closeModal = () => {
    setOpenModal(false);
    setTextbookToDelete(null);
  };

  const columns = useMemo<ColumnDef<CourseContentsViewModel, any>[]>(
    () => [
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => <Header text={t.courseTextbooks.columns.courseCode} />,
        filterFn: "equalsString",
        cell: (x) =>
          x.getValue().includes("/") ? x.getValue().slice(0, -2) : x.getValue(),
        size: 100,
      },
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => <Header text={t.courseTextbooks.columns.courseName} />,
        filterFn: "equalsString",
        size: 300,
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => <Header text={t.courseTextbooks.columns.userName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "ReferenceDate",
        id: "ReferenceDate",
        header: () => <Header text={t.courseTextbooks.columns.contentDate} />,
        filterFn: "equalsString",
        cell: ({ row }) => (
          <span>{formatDateTime(row.original.ReferenceDate)}</span>
        ),
      },
      {
        accessorKey: "LevelName",
        id: "LevelName",
        header: () => <Header text={t.courseTextbooks.columns.levelName} />,
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
                  `/courses/courseTextbooks/${row.original.CourseContentId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.original.CourseId}&textbookDate=${textbookDateSelected.toUTCString()}&referenceDate=${row.original.ReferenceDate.toUTCString()}`,
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
    courseTextbook: CourseContentsViewModel | null,
  ) => {
    try {
      if (courseTextbook) {
        const courseTextbookToDelete = {
          CourseId: courseTextbook.CourseId,
          ReferenceDate: courseTextbook.ReferenceDate,
        };
        const response = await deleteCourseTextbookCoommand(
          courseTextbookToDelete,
        );

        if (!response) {
          throw new Error(`${t.courseTextbooks.notifications.deleteFailure}`);
        }
        toast({
          title: `${t.courseTextbooks.notifications.deleteSuccess}`,
          description: `${t.courseTextbooks.title} : ${textbookToDelete && `${textbookToDelete.CourseCode} ${textbookToDelete.CourseName} - ${formatDate(textbookToDelete.ContentDate)}`}`,
        });
        router.refresh();
        closeModal();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.courseTextbooks.notifications.deleteError}`,
        description: `${error}`,
      });
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
          onRowClick={(row) =>
            router.push(
              `/courses/courseTextbooks/${row.CourseContentId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.CourseId}&textbookDate=${row.ContentDate.toUTCString()}&referenceDate=${row.ReferenceDate.toUTCString()}`,
            )
          }
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
