"use client";

import { useState, useMemo } from "react";
import deleteGradeCoefficientCommand from "@/repositories/gradeCoefficients/commands/deleteGradeCoefficientCommand";
import disableGradeCoefficientCommand from "@/repositories/gradeCoefficients/commands/disableGradeCoefficientCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import Combobox from "@/components/common/combobox";
import DeleteModal from "@/components/common/deleteModal";
import ToggleButton from "@/components/common/toggleButton";
import enumToArray from "@/functions/enumToArray";
import { CoefficientPeriodEnum } from "@/enum/coefficientPeriodEnum";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { GradeCoefficientsViewModel } from "@/repositories/gradeCoefficients/gradeCoefficientsViewModel";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function GradeCoefficientsTable({
  gradeCoefficients,
  isEnabledSelected,
  coefficientPeriodSelected,
  pageIndex,
  pageSize,
  urlParams,
}: {
  gradeCoefficients: GradeCoefficientsViewModel[];
  isEnabledSelected: boolean;
  coefficientPeriodSelected: number;
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
  const [
    selectedGradeCoefficientToDelete,
    setSelectedGradeCoefficientToDelete,
  ] = useState<GradeCoefficientsViewModel | null>();

  const closeModal = () => {
    setOpenModal(false);
    setSelectedGradeCoefficientToDelete(null);
  };

  // const [showEnabledFilter, setShowEnabledFilter] = useState(
  //   urlParams?.isEnabled === "false" ? false : true || true,
  // );

  const gradeCoefficintToDeleteCondition =
    selectedGradeCoefficientToDelete?.IsEnabled;

  const columns = useMemo<ColumnDef<GradeCoefficientsViewModel, any>[]>(
    () => [
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.gradeCoefficients.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "CoefficientNumber",
        id: "CoefficientNumber",
        header: () => <Header text={t.gradeCoefficients.columns.coefficient} />,
        filterFn: "equalsString",
        cell: (x) => <span>{`${x.getValue()} %`}</span>,
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        header: () => <Header text={t.gradeCoefficients.columns.isEnabled} />,
        filterFn: "includesStringSensitive",
        cell: (row) => (
          <span className={`${row.getValue() == 1 ? "text-green-600" : ""}`}>
            {row.getValue() == 1 ? t.shared.yes : t.shared.no}
          </span>
        ),
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
              name="MdEdit"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/courses/gradeCoefficients/${row.row.original.GradeCoefficientId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}`,
                )
              }
            />
            <Icon
              name={`${
                row.row.original.IsEnabled ? "MdNotInterested" : "MdDelete"
              }`}
              className={`cursor-pointer text-xl ${row.row.original.IsEnabled ? "hover:text-primary" : "text-primary hover:text-destructive"}`}
              onClick={() => {
                setOpenModal(true);
                setSelectedGradeCoefficientToDelete(row.row.original);
              }}
            />
          </div>
        ),
      },
    ],
    [getPageIndexParam, getPageSizeParam, isEnabledSelected],
  );

  const deleteGradeCoefficient = async (GradeCoefficientId: number) => {
    try {
      const GradeCoefficientToDelete = {
        GradeCoefficientId: GradeCoefficientId,
      };
      const response = await deleteGradeCoefficientCommand(
        GradeCoefficientToDelete,
      );

      if (!response) {
        throw new Error(`${t.gradeCoefficients.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.gradeCoefficients.notifications.deleteSuccess}`,
        description: `${t.gradeCoefficients.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.gradeCoefficients.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  const disableGradeCoefficient = async (GradeCoefficientId: number) => {
    try {
      const GradeCoefficientToDisable = {
        GradeCoefficientId: GradeCoefficientId,
      };
      const response = await disableGradeCoefficientCommand(
        GradeCoefficientToDisable,
      );

      if (!response) {
        throw new Error(`${t.gradeCoefficients.notifications.disableFailure}`);
      }
      toast({
        title: `${t.gradeCoefficients.notifications.disableSuccess}`,
        description: `${t.gradeCoefficients.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.gradeCoefficients.notifications.disableError}`,
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
        <div className="w-[12rem]">
          <Combobox
            options={enumToArray(CoefficientPeriodEnum)}
            textAttribute="value"
            valueAttribute="key"
            placeholder={" "}
            itemSelected={enumToArray(CoefficientPeriodEnum).find(
              (x) => x.key === coefficientPeriodSelected,
            )}
            setItemSelected={(x: { key: number }) => {
              handleUrlParameterChange("coefficientPeriod", `${x.key}`);
            }}
            notClearable
          />
        </div>
        <div className="w-[25rem]">
          <ToggleButton
            options={[
              { key: true, value: t.shared.enables },
              { key: false, value: t.shared.disables },
            ]}
            setItemSelected={(x: { key: boolean; value: string }) => {
              // setShowEnabledFilter(x.key);
              handleUrlParameterChange("isEnabled", `${x.key}`);
            }}
            itemSelected={isEnabledSelected}
          />
        </div>
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(
              `/courses/gradeCoefficients/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}`,
            )
          }
        >
          <span>{t.gradeCoefficients.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={gradeCoefficients}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        onRowClick={(row) =>
          router.push(
            `/courses/gradeCoefficients/${row.GradeCoefficientId}?action="view"`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={
          gradeCoefficintToDeleteCondition
            ? t.gradeCoefficients.deleteModal.disableTitle
            : t.gradeCoefficients.deleteModal.deleteTitle
        }
        descriptionText={
          gradeCoefficintToDeleteCondition
            ? t.gradeCoefficients.deleteModal.disableDescription
            : t.gradeCoefficients.deleteModal.deleteDescription
        }
        disable={gradeCoefficintToDeleteCondition}
        deletefunction={() =>
          gradeCoefficintToDeleteCondition
            ? disableGradeCoefficient(
                selectedGradeCoefficientToDelete?.GradeCoefficientId || 0,
              )
            : deleteGradeCoefficient(
                selectedGradeCoefficientToDelete?.GradeCoefficientId || 0,
              )
        }
      />
    </div>
  );
}
