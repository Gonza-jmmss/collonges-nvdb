"use client";

import { useState, useMemo } from "react";
import deleteRoleSidebarElementCommand from "@/repositories/roleSidebarElements/commands/deleteRoleSidebarElementCommand";
import { RoleSidebarElementsViewModel } from "@/repositories/roleSidebarElements/roleSidebarElementsViewModel";
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

export default function RoleSidebarElementsTable({
  roleSidebarElementsData,
}: {
  roleSidebarElementsData: RoleSidebarElementsViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedSidebarElementToDelete, setSelectedSidebarElementToDelete] =
    useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedSidebarElementToDelete(0);
  };

  const columns = useMemo<ColumnDef<RoleSidebarElementsViewModel, any>[]>(
    () => [
      {
        accessorKey: "RoleSidebarElementId",
        id: "RoleSidebarElementId",
        header: () => (
          <Header text={t.roleSidebarElements.columns.roleSidebarElementId} />
        ),
        size: 30,
        filterFn: "equalsString",
      },
      {
        accessorKey: "SidebarElementName",
        id: "SidebarElementName",
        header: () => (
          <Header text={t.roleSidebarElements.columns.sidebarElementName} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "ModuleName",
        id: "ModuleName",
        header: () => (
          <Header text={t.roleSidebarElements.columns.moduleName} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "Path",
        id: "Path",
        header: () => <Header text={t.roleSidebarElements.columns.path} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "RoleName",
        id: "RoleName",
        header: () => <Header text={t.roleSidebarElements.columns.roleName} />,
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
              href={`/settings/roleSidebarElements/${row.row.original.RoleSidebarElementId}?action="edit"`}
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
                setSelectedSidebarElementToDelete(
                  row.row.original.RoleSidebarElementId,
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

  const deleteRoleSidebarElement = async (roleSidebarElementId: number) => {
    try {
      const roleSidebarElementToDelete = {
        RoleSidebarElementId: roleSidebarElementId,
      };
      const response = await deleteRoleSidebarElementCommand(
        roleSidebarElementToDelete,
      );

      if (!response) {
        throw new Error(`${t.roleSidebarElements.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.roleSidebarElements.notifications.deleteSuccess}`,
        description: `${t.roleSidebarElements.title} : ${response.ModuleId !== null && response.ModuleId}${response.SidebarElementId !== null && response.SidebarElementId}-${response.RoleId}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roleSidebarElements.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div className="">
      <Table
        columns={columns}
        data={roleSidebarElementsData}
        className=""
        onRowClick={(row) =>
          router.push(
            `/settings/roleSidebarElements/${row.RoleSidebarElementId}?action="view"`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.roleSidebarElements.deleteModal.title}
        descriptionText={t.roleSidebarElements.deleteModal.description}
        deletefunction={() =>
          deleteRoleSidebarElement(selectedSidebarElementToDelete)
        }
      />
    </div>
  );
}
