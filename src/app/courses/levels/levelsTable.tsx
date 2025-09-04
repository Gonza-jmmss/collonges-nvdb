"use client";

import { useState, useMemo } from "react";
import deleteLevelCommand from "@/repositories/levels/commands/deleteLevelCommand";
import disableLevelCommand from "@/repositories/levels/commands/disableLevelCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Modal from "@/components/common/modal";
import DeleteModal from "@/components/common/deleteModal";
import { Button } from "@/components/ui/button";
import ToggleButton from "@/components/common/toggleButton";
import Icon from "@/components/common/icon";
import Combobox from "@/components/common/combobox";
import enumToArray from "@/functions/enumToArray";
import { PeriodEnum } from "@/enum/periodEnum";
import { useToast } from "@/hooks/use-toast";
import {
  LevelsTableViewModel,
  LevelCoursesExtendedViewModel,
} from "@/repositories/levels/levelsViewModel";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import frFR from "@/lang/fr-FR";

export default function LevelsTable({
  levels,
  isEnabledSelected,
  periodNumberSelected,
  pageIndex,
  pageSize,
  urlParams,
}: {
  levels: LevelsTableViewModel[];
  isEnabledSelected: boolean;
  periodNumberSelected: number;
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
  const [openDeleteModalValidation, setOpenDeleteModalValidation] =
    useState(false);
  const [selectedLevelToDelete, setSelectedLevelToDelete] =
    useState<LevelsTableViewModel | null>();

  const closeModal = () => {
    setOpenModal(false);
    setSelectedLevelToDelete(null);
  };

  const [showEnabledFilter, setShowEnabledFilter] = useState(
    urlParams?.isEnabled === "false" ? false : true || true,
  );

  const levelHasCourses = (level: LevelsTableViewModel) => {
    return level?.LevelCourses && level?.LevelCourses.length > 0;
  };
  const levelToDeleteCondition = selectedLevelToDelete?.IsEnabled;

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
        accessorKey: "PeriodName",
        id: "PeriodName",
        header: () => <Header text={t.levels.columns.periodName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        header: () => <Header text={t.levels.columns.isEnabled} />,
        cell: (row) => (
          <span className={`${row.getValue() == 1 ? "text-green-600" : ""}`}>
            {row.getValue() == 1 ? t.shared.yes : t.shared.no}
          </span>
        ),
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
              name="MdEdit"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/courses/levels/${row.row.original?.LevelId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&periodNumber=${periodNumberSelected}`,
                )
              }
            />
            {levelHasCourses(row.row.original) ? (
              <Icon
                name={`${
                  row.row.original.IsEnabled ? "MdNotInterested" : "MdDelete"
                }`}
                className="cursor-pointer text-xl hover:text-primary"
                onClick={() => {
                  if (row.row.original.IsEnabled) {
                    setOpenModal(true);
                    setSelectedLevelToDelete(row.row.original);
                  } else {
                    setOpenDeleteModalValidation(true);
                  }
                }}
              />
            ) : (
              <Icon
                name={`${
                  row.row.original.IsEnabled ? "MdNotInterested" : "MdDelete"
                }`}
                className={`cursor-pointer text-xl ${row.row.original.IsEnabled ? "hover:text-primary" : "text-primary hover:text-destructive"}`}
                onClick={() => {
                  setOpenModal(true);
                  setSelectedLevelToDelete(row.row.original);
                }}
              />
            )}
          </div>
        ),
      },
    ],
    [
      getPageIndexParam,
      getPageSizeParam,
      isEnabledSelected,
      periodNumberSelected,
    ],
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

  const disableLevel = async (LevelId: number) => {
    try {
      const LevelToDisable = { LevelId: LevelId };
      const response = await disableLevelCommand(LevelToDisable);

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
    <div>
      <div className="flex items-center justify-end space-x-5">
        <div className="w-[15rem]">
          <Combobox
            options={enumToArray(PeriodEnum).slice(1)}
            textAttribute="value"
            valueAttribute="key"
            placeholder={t.levels.form.periodNumber}
            itemSelected={enumToArray(PeriodEnum).find(
              (x) => x.key === periodNumberSelected,
            )}
            setItemSelected={(x: { key: number }) => {
              handleUrlParameterChange("periodNumber", `${x.key}`);
            }}
          />
        </div>
        <div className="w-[25rem]">
          <ToggleButton
            options={[
              { key: true, value: t.shared.enables },
              { key: false, value: t.shared.disables },
            ]}
            setItemSelected={(x: { key: boolean; value: string }) => {
              setShowEnabledFilter(x.key);
              handleUrlParameterChange("isEnabled", `${x.key}`);
            }}
            itemSelected={showEnabledFilter}
          />
        </div>
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(
              `/courses/levels/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&periodNumber=${periodNumberSelected}`,
            )
          }
        >
          <span>{t.levels.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={levels}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
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
          levelToDeleteCondition
            ? t.levels.deleteModal.disableTitle
            : t.levels.deleteModal.deleteTitle
        }
        descriptionText={
          levelToDeleteCondition
            ? t.levels.deleteModal.disableDescription
            : t.levels.deleteModal.deleteDescription
        }
        disable={levelToDeleteCondition}
        deletefunction={() =>
          levelToDeleteCondition
            ? disableLevel(selectedLevelToDelete?.LevelId || 0)
            : deleteLevel(selectedLevelToDelete?.LevelId || 0)
        }
      />
      <Modal
        openModal={openDeleteModalValidation}
        closeModal={() => setOpenDeleteModalValidation(false)}
      >
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="mt-2 text-lg font-semibold">{`${t.levels.deleteModalValidation.title}`}</div>
          <div>{`${t.levels.deleteModalValidation.description}`}</div>
        </div>
        <div className="mt-5 flex w-full justify-center space-x-5">
          <Button
            type="button"
            variant={"secondary"}
            className="w-[30%]"
            onClick={() => setOpenDeleteModalValidation(false)}
          >
            {t.shared.cancel}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
