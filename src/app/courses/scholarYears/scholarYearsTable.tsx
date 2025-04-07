"use client";

import { useState, useMemo } from "react";
import deleteScholarYearCommand from "@/repositories/scholarYears/commands/deleteScholarYearCommand";
import disableScholarYearCommand from "@/repositories/scholarYears/commands/disableScholarYearCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import DeleteModal from "@/components/common/deleteModal";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/modal";
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
  const [openDeleteModalValidation, setOpenDeleteModalValidation] =
    useState(false);
  const [selectedScholarYearToDelete, setSelectedScholarYearToDelete] =
    useState<ScholarYearsViewModel | null>(null);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedScholarYearToDelete(null);
  };

  const deleteScholarYearCondition = (
    scholarYear: ScholarYearsViewModel | null,
  ) => {
    return scholarYear ? scholarYear.IsDeletable : false;
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
            {deleteScholarYearCondition(row.row.original) ? (
              <>
                <Icon
                  name={`${!row.row.original.IsActive ? "MdDelete" : "MdNotInterested"}`}
                  className="cursor-pointer text-xl text-primary hover:text-destructive"
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedScholarYearToDelete(row.row.original);
                  }}
                />
              </>
            ) : (
              <>
                <Icon
                  name={`${!row.row.original.IsActive ? "MdDelete" : "MdNotInterested"}`}
                  className="cursor-pointer text-xl hover:text-primary"
                  onClick={() => {
                    if (row.row.original.IsActive) {
                      setOpenModal(true);
                      setSelectedScholarYearToDelete(row.row.original);
                    } else {
                      setOpenDeleteModalValidation(true);
                    }
                  }}
                />
              </>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const deleteScholarYear = async (ScholarYear: ScholarYearsViewModel) => {
    try {
      const scholarYearToDelete = { ScholarYearId: ScholarYear.ScholarYearId };
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

  const disableScholarYear = async (ScholarYear: ScholarYearsViewModel) => {
    try {
      const scholarYearToDelete = { ScholarYearId: ScholarYear.ScholarYearId };
      const response = await disableScholarYearCommand(scholarYearToDelete);

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
        titleText={
          !selectedScholarYearToDelete?.IsActive
            ? t.scholarPeriods.deleteModal.title
            : t.scholarPeriods.deleteModal.disableTitle
        }
        descriptionText={
          !selectedScholarYearToDelete?.IsActive
            ? t.scholarPeriods.deleteModal.description
            : t.scholarPeriods.deleteModal.disableDescription
        }
        deletefunction={() => {
          if (selectedScholarYearToDelete) {
            !selectedScholarYearToDelete.IsActive
              ? deleteScholarYear(selectedScholarYearToDelete)
              : disableScholarYear(selectedScholarYearToDelete);
          }
        }}
        disable={selectedScholarYearToDelete?.IsActive}
      />
      <Modal
        openModal={openDeleteModalValidation}
        closeModal={() => setOpenDeleteModalValidation(false)}
      >
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="mt-2 text-lg font-semibold">{`${t.scholarPeriods.delteModalValidation.title}`}</div>
          <div>{`${t.scholarPeriods.delteModalValidation.description}`}</div>
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
