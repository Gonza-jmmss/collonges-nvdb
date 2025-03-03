"use client";

import { useState, useMemo } from "react";
import deleteScholarPeriodCommand from "@/repositories/scholarPeriods/commands/deleteScholarPeriodCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import DeleteModal from "@/components/common/deleteModal";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import formatDate from "@/functions/formatDate";
import { useToast } from "@/hooks/use-toast";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function ScholarPeriodsTable({
  scholarPeriods,
}: {
  scholarPeriods: ScholarPeriodsViewModel[];
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

  const columns = useMemo<ColumnDef<ScholarPeriodsViewModel, any>[]>(
    () => [
      {
        accessorKey: "ScholarPeriodId",
        id: "ScholarPeriodId",
        header: () => (
          <Header text={t.scholarPeriods.columns.scholarPeriodId} />
        ),
        filterFn: "equalsString",
        size: 20,
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.scholarPeriods.columns.name} />,
        filterFn: "equalsString",
        size: 200,
      },
      {
        accessorKey: "Number",
        id: "Number",
        header: () => <Header text={t.scholarPeriods.columns.number} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "FromDate",
        id: "FromDate",
        header: () => <Header text={t.scholarPeriods.columns.fromDate} />,
        filterFn: "equalsString",
        cell: (row) =>
          row.getValue() !== null ? formatDate(row.getValue()) : "",
      },
      {
        accessorKey: "ToDate",
        id: "ToDate",
        header: () => <Header text={t.scholarPeriods.columns.toDate} />,
        filterFn: "equalsString",
        cell: (row) =>
          row.getValue() !== null ? formatDate(row.getValue()) : "",
      },
      {
        accessorKey: "IsActive",
        id: "IsActive",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.scholarPeriods.columns.isActive} />,
        filterFn: "includesStringSensitive",
      },
      {
        accessorKey: "ScholarYearName",
        id: "ScholarYearName",
        header: () => (
          <Header text={t.scholarPeriods.columns.scholarYearName} />
        ),
        filterFn: "equalsString",
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
                  `/courses/scholarPeriods/${row.row.original.ScholarPeriodId}?action="edit"`,
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
                  row.row.original.ScholarPeriodId,
                );
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const deleteModule = async (ScholarPeriodId: number) => {
    try {
      const moduleToDelete = { ScholarPeriodId: ScholarPeriodId };
      const response = await deleteScholarPeriodCommand(moduleToDelete);

      if (!response) {
        throw new Error(`${t.modules.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.modules.notifications.deleteSuccess}`,
        description: `${t.modules.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.modules.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end space-x-5">
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(`/courses/scholarPeriods/create?action="create"`)
          }
        >
          <span>{t.students.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={scholarPeriods}
        className=""
        onRowClick={(row) =>
          router.push(`/courses/scholarPeriods/${row.StudentId}?action="view"`)
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.modules.deleteModal.title}
        descriptionText={t.modules.deleteModal.description}
        deletefunction={() => deleteModule(selectedScholarPeriodToDelete)}
      />
    </div>
  );
}
