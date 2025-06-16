"use client";

import { useState, useMemo } from "react";
import deleteYearPeriodCommand from "@/repositories/yearPeriods/commands/deleteYearPeriodCommand";
import disableYearPeriodCommand from "@/repositories/yearPeriods/commands/disableYearPeriodCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import ToggleButton from "@/components/common/toggleButton";
import DeleteModal from "@/components/common/deleteModal";
import Modal from "@/components/common/modal";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { yearPeriodsViewModel } from "@/repositories/yearPeriods/yearPeriodsViewModel";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function YearPeriodsTable({
  yearPeriodsData,
  isEnabledSelected,
  pageIndex,
  pageSize,
  urlParams,
}: {
  yearPeriodsData: yearPeriodsViewModel[];
  isEnabledSelected: boolean;
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
  const [selectedYearPeriodToDelete, setSelectedYearPeriodToDelete] =
    useState<yearPeriodsViewModel | null>(null);

  const [showEnabledFilter, setShowEnabledFilter] = useState(
    urlParams?.isEnabled === "false" ? false : true || true,
  );

  const closeModal = () => {
    setOpenModal(false);
    setSelectedYearPeriodToDelete(null);
  };

  const deleteScholarPeriodCondition = (
    yearPeriod: yearPeriodsViewModel | null,
  ) => {
    return yearPeriod ? yearPeriod.IsDeletable : false;
  };

  const columns = useMemo<ColumnDef<yearPeriodsViewModel, any>[]>(
    () => [
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.yearPeriods.columns.name} />,
        filterFn: "equalsString",
        // size: 70,
      },
      {
        accessorKey: "PeriodType",
        id: "PeriodType",
        header: () => <Header text={t.yearPeriods.columns.periodType} />,
        cell: (x) => <span>{YearPeriodsEnum[x.getValue()]}</span>,
        filterFn: "equalsString",
      },
      {
        accessorKey: "ScholarYearName",
        id: "ScholarYearName",
        header: () => <Header text={t.yearPeriods.columns.scholarYearName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        header: () => <Header text={t.yearPeriods.columns.isEnabled} />,
        cell: (x) => (x.getValue() === true ? t.shared.yes : t.shared.no),
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
                  `/students/yearPeriods/${row.row.original.YearPeriodId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}`,
                )
              }
            />
            {deleteScholarPeriodCondition(row.row.original) ? (
              <>
                <Icon
                  name={`${row.row.original.IsEnabled ? "MdNotInterested" : "MdDelete"}`}
                  className={`cursor-pointer text-xl ${row.row.original.IsEnabled ? "hover:text-primary" : "text-primary hover:text-destructive"}`}
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedYearPeriodToDelete(row.row.original);
                  }}
                />
              </>
            ) : (
              <>
                <Icon
                  name={`${!row.row.original.IsEnabled ? "MdDelete" : "MdNotInterested"}`}
                  className="cursor-pointer text-xl hover:text-primary"
                  onClick={() => {
                    if (row.row.original.IsEnabled) {
                      setOpenModal(true);
                      setSelectedYearPeriodToDelete(row.row.original);
                    } else {
                      setOpenDeleteModalValidation(true);
                    }
                  }}
                />
              </>
            )}
            {/* {row.row.original.IsEnabled === true && (
              <Icon
                name="MdDelete"
                className="cursor-pointer text-xl hover:text-primary"
                // onClick={() => {
                //   setOpenModal(true);
                //   setSelectedYearPeriodToDelete(row.row.original.YearPeriodId);
                // }}
              />
            )} */}
          </div>
        ),
      },
    ],
    [getPageIndexParam, getPageSizeParam],
  );

  const deleteYearPeriod = async (YearPeriod: yearPeriodsViewModel) => {
    try {
      const YearPeriodToDelete = { YearPeriodId: YearPeriod.YearPeriodId };
      const response = await deleteYearPeriodCommand(YearPeriodToDelete);

      if (!response) {
        throw new Error(`${t.yearPeriods.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.yearPeriods.notifications.deleteSuccess}`,
        description: `${t.yearPeriods.yearPeriod} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.yearPeriods.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  const disableYearPeriod = async (YearPeriod: yearPeriodsViewModel) => {
    try {
      const YearPeriodToDisable = {
        YearPeriodId: YearPeriod.YearPeriodId,
      };
      const response = await disableYearPeriodCommand(YearPeriodToDisable);

      if (!response) {
        throw new Error(`${t.yearPeriods.notifications.disableFailure}`);
      }
      toast({
        title: `${t.yearPeriods.notifications.disableSuccess}`,
        description: `${t.yearPeriods.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.yearPeriods.notifications.disableError}`,
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
              `/students/yearPeriods/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}`,
            )
          }
        >
          <span>{t.yearPeriods.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={yearPeriodsData}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        onRowClick={(row) =>
          router.push(
            `/students/yearPeriods/${row.YearPeriodId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={
          !selectedYearPeriodToDelete?.IsEnabled
            ? t.yearPeriods.deleteModal.title
            : t.yearPeriods.deleteModal.disableTitle
        }
        descriptionText={
          !selectedYearPeriodToDelete?.IsEnabled
            ? t.yearPeriods.deleteModal.description
            : t.yearPeriods.deleteModal.disableDescription
        }
        deletefunction={() => {
          if (selectedYearPeriodToDelete) {
            !selectedYearPeriodToDelete.IsEnabled
              ? deleteYearPeriod(selectedYearPeriodToDelete)
              : disableYearPeriod(selectedYearPeriodToDelete);
          }
        }}
        disable={selectedYearPeriodToDelete?.IsEnabled}
      />
      <Modal
        openModal={openDeleteModalValidation}
        closeModal={() => setOpenDeleteModalValidation(false)}
      >
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="mt-2 text-lg font-semibold">{`${t.yearPeriods.deleteModalValidation.title}`}</div>
          <div>{`${t.yearPeriods.deleteModalValidation.description}`}</div>
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
