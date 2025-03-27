"use client";

import { useState, useMemo } from "react";
import disableCourseCommand from "@/repositories/courses/commands/disableCourseCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import DeleteModal from "@/components/common/deleteModal";
import ToggleButton from "@/components/common/toggleButton";
import Combobox from "@/components/common/combobox";
import enumToArray from "@/functions/enumToArray";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { CoursesViewModel } from "@/repositories/courses/coursesViewModel";
import { PeriodEnum } from "@/enum/periodEnum";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function CoursesTable({
  coursesData,
  urlParams,
}: {
  coursesData: CoursesViewModel[];
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();
  const updateQuery = useUpdateQuery();

  const [openModal, setOpenModal] = useState(false);
  const [selectedModuleToDisable, setSelectedModuleToDisable] = useState(0);

  const [showEnabledFilter, setShowEnabledFilter] = useState(
    urlParams?.isEnabled === "false" ? false : true || true,
  );

  const [periodFilter, setPeriodFilter] = useState(
    typeof urlParams?.period === "string" ? parseInt(urlParams?.period) : 4,
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
        cell: (x) => x.getValue().slice(0, -2),
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
            <Icon
              name={
                isValidIconName("MdEdit") ? "MdEdit" : "MdOutlineNotInterested"
              }
              // className="cursor-pointer text-xl"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/courses/courses/${row.row.original.CourseId}?action="edit"`,
                )
              }
            />
            <div
              onClick={() => {
                setOpenModal(true);
                setSelectedModuleToDisable(row.row.original.CourseId);
              }}
            >
              <Icon
                name={
                  isValidIconName("MdDelete")
                    ? "MdDelete"
                    : "MdOutlineNotInterested"
                }
                className="cursor-pointer text-xl hover:text-primary"
              />
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

    // Use router.push or history.pushState depending on your navigation setup
    // router.push(newUrl);
    // or
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
              (x) => x.key === periodFilter,
            )}
            setItemSelected={(x: { key: number }) => {
              setPeriodFilter(x && x.key);
              handleUrlParameterChange("period", `${x.key}`);
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
          onClick={() => router.push(`/courses/courses/create?action="create"`)}
        >
          <span>{t.courses.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={coursesData}
        className=""
        onRowClick={(row) =>
          router.push(`/courses/courses/${row.CourseId}?action="view"`)
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
