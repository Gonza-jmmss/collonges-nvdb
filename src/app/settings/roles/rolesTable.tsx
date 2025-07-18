"use client";

import { useState, useMemo } from "react";
import deleteRoleCommand from "@/repositories/roles/commands/deleteRoleCommand";
import disableRoleCommand from "@/repositories/roles/commands/disableRoleCommand";
import { RolesViewModel } from "@/repositories/roles/rolesViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import ToggleButton from "@/components/common/toggleButton";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/common/deleteModal";
import Modal from "@/components/common/modal";
import { useToast } from "@/hooks/use-toast";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function RolesTable({
  rolesData,
  isEnabledSelected,
  urlParams,
}: {
  rolesData: RolesViewModel[];
  isEnabledSelected: boolean;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();
  const updateQuery = useUpdateQuery();

  const [showEnabledFilter, setShowEnabledFilter] = useState(
    urlParams?.isEnabled === "false" ? false : true || true,
  );

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModalValidation, setOpenDeleteModalValidation] =
    useState(false);
  const [selectedRoleToDelete, setSelectedRoleToDelete] =
    useState<RolesViewModel | null>(null);
  const [isPending, setIsPending] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedRoleToDelete(null);
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
        cell: ({ row }) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon
              name={"MdEdit"}
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/settings/roles/${row.original.RoleId}?action="edit"&isEnabled=${isEnabledSelected}`,
                )
              }
            />
            {row.original.isDeletable ? (
              <>
                <Icon
                  name={`${row.original.IsEnabled ? "MdNotInterested" : "MdDelete"}`}
                  className={`cursor-pointer text-xl ${row.original.IsEnabled ? "hover:text-primary" : "text-destructive hover:text-red-700"}`}
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedRoleToDelete(row.original);
                  }}
                />
              </>
            ) : (
              <>
                <Icon
                  name={`${!row.original.IsEnabled ? "MdDelete" : "MdNotInterested"}`}
                  className="cursor-pointer text-xl hover:text-primary"
                  onClick={() => {
                    if (row.original.IsEnabled) {
                      setOpenModal(true);
                      setSelectedRoleToDelete(row.original);
                    } else {
                      setOpenDeleteModalValidation(true);
                    }
                  }}
                />
              </>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const deleteRole = async (Role: RolesViewModel) => {
    try {
      setIsPending(true);
      const roleToDelete = { RoleId: Role.RoleId };
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
    } finally {
      setIsPending(false);
    }
  };

  const disableRole = async (Role: RolesViewModel) => {
    try {
      setIsPending(true);
      const roleToDisable = { RoleId: Role.RoleId };
      const response = await disableRoleCommand(roleToDisable);

      if (!response) {
        throw new Error(`${t.roles.notifications.disableFailure}`);
      }
      toast({
        title: `${t.roles.notifications.disableSuccess}`,
        description: `${t.roles.title} : ${response.Name}`,
      });
      closeModal();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.roles.notifications.disableError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
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
              `/settings/roles/create?action="create"&isEnabled=${isEnabledSelected}`,
            )
          }
        >
          <span>{t.roles.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={rolesData}
        className=""
        onRowClick={(row) =>
          router.push(
            `/settings/roles/${row.RoleId}?action="view"&isEnabled=${isEnabledSelected}`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        isPending={isPending}
        titleText={
          !selectedRoleToDelete?.IsEnabled
            ? t.roles.deleteModal.title
            : t.roles.deleteModal.disableTitle
        }
        descriptionText={
          !selectedRoleToDelete?.IsEnabled
            ? t.roles.deleteModal.description
            : t.roles.deleteModal.disableDescription
        }
        deletefunction={() => {
          if (selectedRoleToDelete) {
            !selectedRoleToDelete.IsEnabled
              ? deleteRole(selectedRoleToDelete)
              : disableRole(selectedRoleToDelete);
          }
        }}
        disable={selectedRoleToDelete?.IsEnabled}
      />
      <Modal
        openModal={openDeleteModalValidation}
        closeModal={() => setOpenDeleteModalValidation(false)}
      >
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="mt-2 text-lg font-semibold">{`${t.roles.deleteModalValidation.title}`}</div>
          <div>{`${t.roles.deleteModalValidation.description}`}</div>
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
