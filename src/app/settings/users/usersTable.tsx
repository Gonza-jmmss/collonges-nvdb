"use client";

import { useState, useMemo } from "react";
import deleteUserCommand from "@/repositories/users/commands/deleteUserCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Link from "next/link";
import { getAllUsersQueryViewModel } from "@/repositories/users/usersViewModel";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import DeleteModal from "@/components/common/deleteModal";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function UsersTable({
  usersData,
}: {
  usersData: getAllUsersQueryViewModel[];
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [selectedUSerToDelete, setSelectedUSerToDelete] = useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedUSerToDelete(0);
  };

  const columns = useMemo<ColumnDef<getAllUsersQueryViewModel, any>[]>(
    () => [
      {
        accessorKey: "UserId",
        id: "UserId",
        header: () => <Header text={t.users.columns.userId} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => <Header text={t.users.columns.userName} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "RoleName",
        id: "RoleName",
        header: () => <Header text={t.users.columns.roleName} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        header: () => <Header text={t.users.columns.isEnabled} />,
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
            <Link
              href={`/settings/users/${row.row.original.UserId}?action="password"`}
              className="flex flex-col space-y-2 hover:text-primary"
            >
              <Icon
                name={
                  isValidIconName("MdPassword")
                    ? "MdPassword"
                    : "MdOutlineNotInterested"
                }
                className="cursor-pointer text-xl"
              />
            </Link>
            <Link
              href={`/settings/users/${row.row.original.UserId}?action="edit"`}
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
                setSelectedUSerToDelete(row.row.original.UserId);
              }}
            >
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

  const deleteUser = async (UserId: number) => {
    try {
      const UserToDelete = { UserId: UserId };
      const response = await deleteUserCommand(UserToDelete);

      if (!response) {
        throw new Error(`${t.users.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.users.notifications.deleteSuccess}`,
        description: `${t.users.title} : ${response.UserName}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.users.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div className="">
      <Table
        columns={columns}
        data={usersData}
        className=""
        onRowClick={(row) =>
          router.push(`/settings/users/${row.UserId}?action="view"`)
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.users.deleteModal.title}
        descriptionText={t.users.deleteModal.description}
        deletefunction={() => deleteUser(selectedUSerToDelete)}
        desable
      />
    </div>
  );
}
