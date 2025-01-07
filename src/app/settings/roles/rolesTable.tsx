"use client";

import { useMemo } from "react";
import deleteRoleCommand from "@/repositories/roles/commands/deleteRoleCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Link from "next/link";
import { RolesViewModel } from "@/repositories/roles/rolesViewModel";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
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
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.student.columns.actions} />,
        size: 50,
        cell: (row) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Link
              href={`/settings/roles/${row.row.original.RoleId}?action="edit"`}
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
            <div onClick={() => deleteRole(row.row.original.RoleId)}>
              <Icon
                name={
                  isValidIconName("MdDelete")
                    ? "MdDelete"
                    : "MdOutlineNotInterested"
                }
                className="cursor-pointer text-xl"
              />
            </div>
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
    </div>
  );
}
