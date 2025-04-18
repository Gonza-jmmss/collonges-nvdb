"use client";

import { useState, useMemo } from "react";
import disableCourseCommand from "@/repositories/courses/commands/disableCourseCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import DeleteModal from "@/components/common/deleteModal";
import ToggleButton from "@/components/common/toggleButton";
import Combobox from "@/components/common/combobox";
import enumToArray from "@/functions/enumToArray";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { CoursesViewModel } from "@/repositories/courses/coursesViewModel";
import { PeriodEnum } from "@/enum/periodEnum";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function CoursesTable({
  coursesData,
  isEnabledSelected,
  periodNumberSelected,
  userRoleName,
  pageIndex,
  pageSize,
  urlParams,
}: {
  coursesData: CoursesViewModel[];
  isEnabledSelected: boolean;
  periodNumberSelected: number;
  userRoleName: string | undefined;
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
  const [selectedModuleToDisable, setSelectedModuleToDisable] = useState(0);

  const [showEnabledFilter, setShowEnabledFilter] = useState(
    urlParams?.isEnabled === "false" ? false : true || true,
  );

  const columns = useMemo<ColumnDef<CoursesViewModel, any>[]>(
    () => [
      {
        accessorKey: "CourseId",
        id: "CourseId",
        header: () => <Header text={t.courses.columns.courseId} />,
        filterFn: "equalsString",
        size: 10,
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.courses.columns.name} />,
        filterFn: "equalsString",
        size: 200,
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => <Header text={t.courses.columns.courseCode} />,
        cell: (x) =>
          x.getValue().includes("/") ? x.getValue().slice(0, -2) : x.getValue(),
        filterFn: "equalsString",
        size: 30,
      },
      {
        accessorKey: "PeriodNumber",
        id: "PeriodNumber",
        header: () => <Header text={t.courses.columns.periodNumber} />,
        filterFn: "equalsString",
        size: 10,
      },
      {
        accessorKey: "CreditAmount",
        id: "CreditAmount",
        header: () => <Header text={t.courses.columns.creditAmount} />,
        filterFn: "equalsString",
        size: 10,
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.courses.columns.isEnabled} />,
        filterFn: "includesStringSensitive",
        size: 10,
      },
      {
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.shared.actions} />,
        size: 20,
        cell: (row) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            {userRoleName !== "Professeur" && (
              <>
                <Icon
                  name="MdEdit"
                  // className="cursor-pointer text-xl"
                  className="cursor-pointer text-xl hover:text-primary"
                  onClick={() =>
                    router.push(
                      `/courses/courses/${row.row.original.CourseId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&periodNumber=${periodNumberSelected}&isEnabled=${isEnabledSelected}`,
                    )
                  }
                />
                {row.row.original.IsEnabled ? (
                  <Icon
                    name={`${
                      row.row.original.IsEnabled
                        ? "MdNotInterested"
                        : "MdDelete"
                    }`}
                    className="cursor-pointer text-xl hover:text-primary"
                    onClick={() => {
                      setOpenModal(true);
                      setSelectedModuleToDisable(row.row.original.CourseId);
                    }}
                  />
                ) : (
                  <></>
                )}
              </>
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

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedModuleToDisable(0);
  };

  const disableCourse = async (courseId: number) => {
    try {
      const courseToDelete = { CourseId: courseId };
      const response = await disableCourseCommand(courseToDelete);

      if (!response) {
        throw new Error(`${t.courses.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.courses.notifications.deleteSuccess}`,
        description: `${t.courses.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.courses.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end space-x-5">
        <div className="w-[15rem]">
          <Combobox
            options={enumToArray(PeriodEnum)}
            textAttribute="value"
            valueAttribute="key"
            placeholder={t.courses.form.periodNumber}
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
        {userRoleName !== "Professeur" && (
          <Button
            variant="outlineColored"
            onClick={() =>
              router.push(
                `/courses/courses/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&periodNumber=${periodNumberSelected}&isEnabled=${isEnabledSelected}`,
              )
            }
          >
            <span>{t.courses.create}</span>
          </Button>
        )}
      </div>
      <Table
        columns={columns}
        data={coursesData}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        onRowClick={(row) =>
          router.push(
            `/courses/courses/${row.CourseId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&periodNumber=${periodNumberSelected}&isEnabled=${isEnabledSelected}`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.users.deleteModal.title}
        descriptionText={t.users.deleteModal.description}
        deletefunction={() => disableCourse(selectedModuleToDisable)}
        disable
      />
    </div>
  );
}
