"use client";

import { useState, useMemo } from "react";
import deleteRoleCommand from "@/repositories/roles/commands/deleteRoleCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { RolesViewModel } from "@/repositories/roles/rolesViewModel";
import Icon from "@/components/common/icon";
import DeleteModal from "@/components/common/deleteModal";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function RolesTable({
  rolesData,
}: {
  rolesData: RolesViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedRoleToDelete, setSelectedRoleToDelete] = useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedRoleToDelete(0);
  };

  const columns = useMemo<ColumnDef<RolesViewModel, any>[]>(
    () => [
      {
        accessorKey: "RoleId",
        id: "RoleId",
        header: () => <Header text={t.roles.columns.roleId} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.roles.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        header: () => <Header text={t.roles.columns.isEnabled} />,
        cell: (row) =>
          row.row.original.IsEnabled ? t.shared.yes : t.shared.no,
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
              name={"MdEdit"}
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/settings/roles/${row.row.original.RoleId}?action="edit"`,
                )
              }
            />
            {row.row.original.IsEnabled && (
              <div
                onClick={() => {
                  setOpenModal(true);
                  setSelectedRoleToDelete(row.row.original.RoleId);
                }}
              >
                <Icon
                  name={"MdNotInterested"}
                  className="cursor-pointer text-xl"
                />
              </div>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const deleteRole = async (roleId: number) => {
    try {
      const roleToDelete = { RoleId: roleId };
      const response = await deleteRoleCommand(roleToDelete);

      if (!response) {
        throw new Error(`${t.roles.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.roles.notifications.deleteSuccess}`,
        description: `${t.roles.title} : ${response.Name}`,
      });
      closeModal();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roles.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div className="">
      <Table
        columns={columns}
        data={rolesData}
        className=""
        onRowClick={(row) =>
          router.push(`/settings/roles/${row.RoleId}?action="view"`)
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.roles.deleteModal.title}
        descriptionText={t.roles.deleteModal.description}
        deletefunction={() => deleteRole(selectedRoleToDelete)}
        disable
      />
    </div>
  );
}
