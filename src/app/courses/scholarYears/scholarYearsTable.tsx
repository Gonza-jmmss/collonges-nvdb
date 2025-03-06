"use client";

import { useState, useMemo } from "react";
import deleteScholarYearCommand from "@/repositories/scholarYears/commands/deleteScholarYearCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import DeleteModal from "@/components/common/deleteModal";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import formatDate from "@/functions/formatDate";
import { useToast } from "@/hooks/use-toast";
import { ScholarYearsViewModel } from "@/repositories/scholarYears/scholarYearsViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function ScholarYearsTable({
  scholarYears,
}: {
  scholarYears: ScholarYearsViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedScholarPeriodToDelete, setSelectedScholarPeriodToDelete] =
    useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedScholarPeriodToDelete(0);
  };
  const columns = useMemo<ColumnDef<ScholarYearsViewModel, any>[]>(
    () => [
      {
        accessorKey: "ScholarYearId",
        id: "ScholarYearId",
        header: () => <Header text={t.scholarYears.columns.scholarYearId} />,
        filterFn: "equalsString",
        size: 20,
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.scholarYears.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "FromDate",
        id: "FromDate",
        header: () => <Header text={t.scholarYears.columns.fromDate} />,
        filterFn: "equalsString",
        cell: (row) =>
          row.getValue() !== null ? formatDate(row.getValue()) : "",
      },
      {
        accessorKey: "ToDate",
        id: "ToDate",
        header: () => <Header text={t.scholarYears.columns.toDate} />,
        filterFn: "equalsString",
        cell: (row) =>
          row.getValue() !== null ? formatDate(row.getValue()) : "",
      },
      {
        accessorKey: "IsActive",
        id: "IsActive",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.scholarYears.columns.isActive} />,
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
                  `/courses/scholarYears/${row.row.original.ScholarYearId}?action="edit"`,
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
                setSelectedScholarPeriodToDelete(
                  row.row.original.ScholarYearId,
                );
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const deleteScholarYear = async (ScholarYearId: number) => {
    try {
      const scholarYearToDelete = { ScholarYearId: ScholarYearId };
      const response = await deleteScholarYearCommand(scholarYearToDelete);

      if (!response) {
        throw new Error(`${t.scholarYears.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.scholarYears.notifications.deleteSuccess}`,
        description: `${t.scholarYears.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.scholarYears.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  const countActiveYears = () => {
    return scholarYears.filter((x) => x.IsActive === true).length;
  };

  return (
    <div>
      <div className="flex items-center justify-end space-x-5">
        {countActiveYears() > 1 && (
          <div className="flex items-center space-x-2 rounded-md border border-destructive bg-destructive px-3 py-1">
            <Icon
              name={
                isValidIconName("MdWarningAmber")
                  ? "MdWarningAmber"
                  : "MdOutlineNotInterested"
              }
              className="text-2xl text-background"
            />
            <div className="font-semibold text-background">
              {t.scholarYears.warningActiveYears}
            </div>
          </div>
        )}
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(`/courses/scholarYears/create?action="create"`)
          }
        >
          <span>{t.scholarYears.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={scholarYears}
        className=""
        onRowClick={(row) =>
          router.push(
            `/courses/scholarYears/${row.ScholarYearId}?action="view"`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.modules.deleteModal.title}
        descriptionText={t.modules.deleteModal.description}
        deletefunction={() => deleteScholarYear(selectedScholarPeriodToDelete)}
      />
    </div>
  );
}
