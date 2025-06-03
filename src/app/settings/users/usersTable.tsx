"use client";

import { useState, useMemo } from "react";
import deleteUserCommand from "@/repositories/users/commands/deleteUserCommand";
import { getAllUsersQueryViewModel } from "@/repositories/users/usersViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import ToggleButton from "@/components/common/toggleButton";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/common/deleteModal";
import { useToast } from "@/hooks/use-toast";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function UsersTable({
  usersData,
  isEnabledSelected,
  isStudentSelected,
  pageIndex,
  pageSize,
  urlParams,
}: {
  usersData: getAllUsersQueryViewModel[];
  isEnabledSelected: boolean;
  isStudentSelected: boolean;
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
        filterFn: "equalsString",
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => <Header text={t.users.columns.userName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "RoleName",
        id: "RoleName",
        header: () => <Header text={t.users.columns.roleName} />,
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
            <Icon
              name="MdPassword"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/settings/users/${row.row.original.UserId}?action="password"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&isStudent=${isStudentSelected}`,
                )
              }
            />
            <Icon
              name="MdEdit"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/settings/users/${row.row.original.UserId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&isStudent=${isStudentSelected}`,
                )
              }
            />
            <Icon
              name="MdDelete"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() => {
                setOpenModal(true);
                setSelectedUSerToDelete(row.row.original.UserId);
              }}
            />
          </div>
        ),
      },
    ],
    [getPageIndexParam, getPageSizeParam, isEnabledSelected, isStudentSelected],
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
        <div className="w-[20rem]">
          <ToggleButton
            options={[
              { key: true, value: t.users.toggle.student },
              { key: false, value: t.users.toggle.others },
            ]}
            setItemSelected={(x: { key: boolean; value: string }) => {
              handleUrlParameterChange("isStudent", `${x.key}`);
            }}
            itemSelected={isStudentSelected}
          />
        </div>
        <div className="w-[20rem]">
          <ToggleButton
            options={[
              { key: true, value: t.shared.enables },
              { key: false, value: t.shared.disables },
            ]}
            setItemSelected={(x: { key: boolean; value: string }) => {
              handleUrlParameterChange("isEnabled", `${x.key}`);
            }}
            itemSelected={isEnabledSelected}
          />
        </div>
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(
              `/settings/users/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&isStudent=${isStudentSelected}`,
            )
          }
        >
          <span>{t.users.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={usersData}
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        onRowClick={(row) =>
          router.push(
            `/settings/users/${row.UserId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&isStudent=${isStudentSelected}`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.users.deleteModal.title}
        descriptionText={t.users.deleteModal.description}
        deletefunction={() => deleteUser(selectedUSerToDelete)}
        disable
      />
    </div>
  );
}
