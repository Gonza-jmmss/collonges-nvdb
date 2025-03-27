"use client";

import { useState, useMemo } from "react";
import deleteLevelCommand from "@/repositories/levels/commands/deleteLevelCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import DeleteModal from "@/components/common/deleteModal";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useToast } from "@/hooks/use-toast";
import {
  LevelsTableViewModel,
  LevelCoursesExtendedViewModel,
} from "@/repositories/levels/levelsViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function LevelsTable({
  levels,
}: {
  levels: LevelsTableViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedLevelToDelete, setSelectedLevelToDelete] =
    useState<LevelsTableViewModel | null>();

  const closeModal = () => {
    setOpenModal(false);
    setSelectedLevelToDelete(null);
  };

  const columns = useMemo<ColumnDef<LevelsTableViewModel, any>[]>(
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
            {row.original.LevelCourses.length > 0 && row.getCanExpand() ? (
              <div onClick={row.getToggleExpandedHandler()}>
                {row.getIsExpanded() ? (
                  <Icon
                    name={
                      isValidIconName("MdArrowDownward")
                        ? "MdArrowDownward"
                        : "MdOutlineNotInterested"
                    }
                    className="cursor-pointer"
                  />
                ) : (
                  <Icon
                    name={
                      isValidIconName("MdArrowForward")
                        ? "MdArrowForward"
                        : "MdOutlineNotInterested"
                    }
                    className="cursor-pointer"
                  />
                )}
              </div>
            ) : (
              <Icon
                name={
                  isValidIconName("MdHorizontalRule")
                    ? "MdHorizontalRule"
                    : "MdOutlineNotInterested"
                }
              />
            )}
          </div>
        ),
        size: 5,
      },
      {
        accessorKey: "",
        id: "2",
        header: () => <Header text={t.levels.columns.coursesAsigned} />,
        filterFn: "equalsString",
        cell: ({ row }) => <span>{row.original.LevelCourses.length}</span>,
        size: 20,
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.levels.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.levels.columns.isEnabled} />,
        filterFn: "includesStringSensitive",
      },
      {
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.shared.actions} />,
        size: 50,
        cell: (row) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon
              name={
                isValidIconName("MdEdit") ? "MdEdit" : "MdOutlineNotInterested"
              }
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/courses/levels/${row.row.original?.LevelId}?action="edit"`,
                )
              }
            />
            <Icon
              name={
                isValidIconName("MdDelete")
                  ? "MdDelete"
                  : "MdOutlineNotInterested"
              }
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() => {
                setOpenModal(true);
                setSelectedLevelToDelete(row.row.original);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const columnsExtended = useMemo<
    ColumnDef<LevelCoursesExtendedViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => <Header text={t.levels.expanded.courseName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => <Header text={t.levels.expanded.courseCode} />,
        filterFn: "equalsString",
        size: 30,
      },
    ],
    [],
  );

  const deleteLevel = async (LevelId: number) => {
    try {
      const LevelToDelete = { LevelId: LevelId };
      const response = await deleteLevelCommand(LevelToDelete);

      if (!response) {
        throw new Error(`${t.levels.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.levels.notifications.deleteSuccess}`,
        description: `${t.levels.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.levels.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end space-x-5">
        <Button
          variant="outlineColored"
          onClick={() => router.push(`/courses/levels/create?action="create"`)}
        >
          <span>{t.levels.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={levels}
        className=""
        expandable
        expandedContent={(row) => (
          <Table
            columns={columnsExtended}
            data={row.LevelCourses}
            minimalMode
            noBorders
          />
        )}
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={
          selectedLevelToDelete?.LevelCourses &&
          selectedLevelToDelete?.LevelCourses.length > 0
            ? t.levels.deleteModal.disableTitle
            : t.levels.deleteModal.deleteTitle
        }
        descriptionText={
          selectedLevelToDelete?.LevelCourses &&
          selectedLevelToDelete?.LevelCourses.length > 0
            ? t.levels.deleteModal.disableDescription
            : t.levels.deleteModal.deleteDescription
        }
        deletefunction={() => deleteLevel(selectedLevelToDelete?.LevelId || 0)}
      />
    </div>
  );
}
