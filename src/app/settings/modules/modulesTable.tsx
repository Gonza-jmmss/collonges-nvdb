"use client";

import { useState, useMemo } from "react";
import deleteModuleCommand from "@/repositories/modules/commands/deleteModuleCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import DeleteModal from "@/components/common/deleteModal";
import Link from "next/link";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function ModulesTable({
  modulesData,
}: {
  modulesData: ModulesViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedModuleToDelete, setSelectedModuleToDelete] = useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedModuleToDelete(0);
  };

  const columns = useMemo<ColumnDef<ModulesViewModel, any>[]>(
    () => [
      {
        accessorKey: "ModuleId",
        id: "ModuleId",
        header: () => <Header text={t.modules.columns.moduleId} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.modules.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Path",
        id: "Path",
        header: () => <Header text={t.modules.columns.path} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Icon",
        id: "Icon",
        header: () => <Header text={t.modules.columns.icon} />,
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
        accessorKey: "Location",
        id: "Location",
        header: () => <Header text={t.modules.columns.location} />,
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
              href={`/settings/modules/${row.row.original.ModuleId}?action="edit"`}
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
                setSelectedModuleToDelete(row.row.original.ModuleId);
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

  const deleteModule = async (moduleId: number) => {
    try {
      const moduleToDelete = { ModuleId: moduleId };
      const response = await deleteModuleCommand(moduleToDelete);

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
    <div className="">
      <Table
        columns={columns}
        data={modulesData}
        className=""
        onRowClick={(row) =>
          router.push(`/settings/modules/${row.ModuleId}?action="view"`)
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.modules.deleteModal.title}
        descriptionText={t.modules.deleteModal.description}
        deletefunction={() => deleteModule(selectedModuleToDelete)}
      />
    </div>
  );
}
