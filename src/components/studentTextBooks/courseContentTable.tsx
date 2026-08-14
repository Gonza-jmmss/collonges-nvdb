"use client";

import { useEffect } from "react";
import { useMemo } from "react";
import { CourseContentsViewModel } from "@/repositories/courseTextbook/courseTextbookViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentCourseContentTable({
  courseTextbooksData,
  tabValue,
}: {
  courseTextbooksData: CourseContentsViewModel[];
  tabValue: string;
}) {
  const t = frFR;
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const columns = useMemo<ColumnDef<CourseContentsViewModel, any>[]>(
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
        accessorKey: "LevelName",
        id: "LevelName",
        header: () => (
          <Header text={t.courseTextbooks.columnsExtended.levelName} />
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const mobileColumns = useMemo<ColumnDef<CourseContentsViewModel, any>[]>(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => <Header text={t.studentProfile.columns.courseName} />,
        cell: ({ row }) => (
          <div>
            <div className="flex space-x-2">
              <span className="text-sm font-semibold">
                {t.courseTextbooks.columnsExtended.courseName}:
              </span>
              <span className="text-sm">{`${row.original.CourseName}`}</span>
            </div>
            <div className="flex space-x-2">
              <span className="text-sm font-semibold">
                {t.courseTextbooks.columnsExtended.courseCode}:
              </span>
              <span className="text-sm">{`${row.original.CourseCode}`}</span>
              <span className="text-sm font-semibold">
                {t.courseTextbooks.columns.levelName}:
              </span>
              <span className="text-sm">{row.original.LevelName}</span>
            </div>
            <div className="flex space-x-2">
              <span className="text-sm font-semibold">
                {t.courseTextbooks.columnsExtended.userName}:
              </span>
              <span className="text-sm">{row.original.UserName}</span>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

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
  }, [tabValue]);

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex">
        <div className="mt-1 w-full">
          <Table
            columns={columns}
            data={courseTextbooksData}
            className=""
            onRowClick={(row) =>
              router.push(
                `/studentHome/textbooks/${row.CourseContentId}?courseId=${row.CourseId}&referenceDate=${row.ReferenceDate.toUTCString()}&textbookDate=${row.ContentDate.toUTCString()}`,
              )
            }
            minimalMode
          />
        </div>
      </div>
      {/* Mobile */}
      <div className="mt-2 sm:hidden">
        <div>
          <Table
            columns={mobileColumns}
            data={courseTextbooksData}
            className=""
            onRowClick={(row) =>
              router.push(
                `/studentHome/textbooks/${row.CourseContentId}?courseId=${row.CourseId}&referenceDate=${row.ReferenceDate.toUTCString()}&textbookDate=${row.ContentDate.toUTCString()}`,
              )
            }
            minimalMode
          />
        </div>
      </div>
      {/* <pre>{JSON.stringify(attendancesData, null, 2)}</pre> */}
    </>
  );
}
