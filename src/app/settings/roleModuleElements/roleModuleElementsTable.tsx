"use client";

import { useState, useMemo } from "react";
import deleteRoleModuleElementCommand from "@/repositories/roleModuleElements/commands/deleteRoleModuleElementCommand";
import { RoleModuleElementsViewModel } from "@/repositories/roleModuleElements/roleModuleElementsViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import DeleteModal from "@/components/common/deleteModal";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function RoleModuleElementsTable({
  roleModuleElementsData,
}: {
  roleModuleElementsData: RoleModuleElementsViewModel[];
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

  const columns = useMemo<ColumnDef<RoleModuleElementsViewModel, any>[]>(
    () => [
      {
        accessorKey: "RoleModuleElementId",
        id: "RoleModuleElementId",
        header: () => (
          <Header text={t.roleModuleElements.columns.roleModuleElementId} />
        ),
        size: 30,
        filterFn: "equalsString",
      },
      {
        accessorKey: "ModuleElementName",
        id: "ModuleElementName",
        header: () => (
          <Header text={t.roleModuleElements.columns.moduleElementName} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "ModuleName",
        id: "ModuleName",
        header: () => <Header text={t.roleModuleElements.columns.moduleName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Path",
        id: "Path",
        header: () => <Header text={t.roleModuleElements.columns.path} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "RoleName",
        id: "RoleName",
        header: () => <Header text={t.roleModuleElements.columns.roleName} />,
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
              href={`/settings/roleModuleElements/${row.row.original.RoleModuleElementId}?action="edit"`}
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
                  row.row.original.RoleModuleElementId,
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

  const deleteRoleModuleElement = async (roleModuleElementId: number) => {
    try {
      const roleModuleElementToDelete = {
        RoleModuleElementId: roleModuleElementId,
      };
      const response = await deleteRoleModuleElementCommand(
        roleModuleElementToDelete,
      );

      if (!response) {
        throw new Error(`${t.roleModuleElements.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.roleModuleElements.notifications.deleteSuccess}`,
        description: `${t.roleModuleElements.title} : ${response.ModuleId !== null ? response.ModuleId : ""}${response.ModuleElementId !== null ? response.ModuleElementId : ""}-${response.RoleId}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roleModuleElements.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div className="">
      <Table
        columns={columns}
        data={roleModuleElementsData}
        className=""
        onRowClick={(row) =>
          router.push(
            `/settings/roleModuleElements/${row.RoleModuleElementId}?action="view"`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.roleModuleElements.deleteModal.title}
        descriptionText={t.roleModuleElements.deleteModal.description}
        deletefunction={() =>
          deleteRoleModuleElement(selectedModuleElementToDelete)
        }
      />
    </div>
  );
}
