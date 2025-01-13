"use client";

import { useState, useMemo } from "react";
import deleteModuleElementCommand from "@/repositories/moduleElements/commands/deleteModuleElementCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import DeleteModal from "@/components/common/deleteModal";
import Link from "next/link";
import { ModuleElementsViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function ModuleElementsTable({
  moduleElementsData,
}: {
  moduleElementsData: ModuleElementsViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedModuleElementToDelete, setSelectedModuleElementToDelete] =
    useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedModuleElementToDelete(0);
  };

  const columns = useMemo<ColumnDef<ModuleElementsViewModel, any>[]>(
    () => [
      {
        accessorKey: "ModuleElementId",
        id: "ModuleElementId",
        header: () => (
          <Header text={t.moduleElements.columns.moduleElementId} />
        ),
        size: 30,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.moduleElements.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Path",
        id: "Path",
        header: () => <Header text={t.moduleElements.columns.path} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Icon",
        id: "Icon",
        header: () => <Header text={t.moduleElements.columns.icon} />,
        size: 50,
        cell: (row) => (
          <Icon
            name={
              isValidIconName(row.row.original.Icon)
                ? row.row.original.Icon
                : "MdOutlineNotInterested"
            }
            className="cursor-pointer text-xl"
          />
        ),
      },
      {
        accessorKey: "ModuleName",
        id: "ModuleName",
        header: () => <Header text={t.moduleElements.columns.moduleName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Location",
        id: "Location",
        header: () => <Header text={t.moduleElements.columns.location} />,
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
            <Link
              href={`/settings/moduleElements/${row.row.original.ModuleElementId}?action="edit"`}
              className="flex flex-col space-y-2 hover:text-primary"
            >
              <Icon
                name={
                  isValidIconName("MdEdit")
                    ? "MdEdit"
                    : "MdOutlineNotInterested"
                }
                className="cursor-pointer text-xl"
              />
            </Link>
            <div
              onClick={() => {
                setOpenModal(true);
                setSelectedModuleElementToDelete(
                  row.row.original.ModuleElementId,
                );
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

  const deleteModuleElement = async (moduleElementId: number) => {
    try {
      const moduleElementToDelete = { ModuleElementId: moduleElementId };
      const response = await deleteModuleElementCommand(moduleElementToDelete);

      if (!response) {
        throw new Error(`${t.moduleElements.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.moduleElements.notifications.deleteSuccess}`,
        description: `${t.moduleElements.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.moduleElements.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div className="">
      <Table
        columns={columns}
        data={moduleElementsData}
        className=""
        onRowClick={(row) =>
          router.push(
            `/settings/moduleElements/${row.ModuleElementId}?action="view"`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.moduleElements.deleteModal.title}
        descriptionText={t.moduleElements.deleteModal.description}
        deletefunction={() =>
          deleteModuleElement(selectedModuleElementToDelete)
        }
      />
    </div>
  );
}
