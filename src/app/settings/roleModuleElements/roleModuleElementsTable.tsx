"use client";

import { useState, useMemo } from "react";
import deleteRoleModuleElementCommand from "@/repositories/roleModuleElements/commands/deleteRoleModuleElementCommand";
import {
  RoleModuleElementsGroupedViewModel,
  RoleModuleElemensByRole,
} from "@/repositories/roleModuleElements/roleModuleElementsViewModel";
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
  roleModuleElementsData: RoleModuleElementsGroupedViewModel[];
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

  const columns = useMemo<ColumnDef<RoleModuleElementsGroupedViewModel, any>[]>(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => <Header text="" />,
        cell: ({ row }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {row.original.Modules.length > 0 && row.getCanExpand() ? (
              <div onClick={row.getToggleExpandedHandler()}>
                {row.getIsExpanded() ? (
                  <Icon name="MdArrowDownward" className="cursor-pointer" />
                ) : (
                  <Icon name="MdArrowForward" className="cursor-pointer" />
                )}
              </div>
            ) : (
              <Icon name="MdHorizontalRule" />
            )}
          </div>
        ),
        size: 5,
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
            {/* <Icon name={"MdEdit"} className="cursor-pointer text-xl" /> */}
            <Icon
              name="MdEdit"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/settings/roleModuleElements/${row.row.original.RoleId}?action="edit"`,
                )
              }
            />
            {/* <Link
              href={`/settings/roleModuleElements/${row.row.original.RoleId}?action="edit"`}
              className="flex flex-col space-y-2 hover:text-primary"
            >
              <Icon name={"MdEdit"} className="cursor-pointer text-xl" />
            </Link> */}
            <div
              onClick={() => {
                setOpenModal(true);
                setSelectedModuleElementToDelete(row.row.original.RoleId);
              }}
            >
              <Icon
                name={"MdDelete"}
                className="cursor-pointer text-xl hover:text-primary"
              />
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  const columnsModulesExtended = useMemo<
    ColumnDef<RoleModuleElemensByRole, any>[]
  >(
    () => [
      {
        accessorKey: "ModuleName",
        id: "ModuleName",
        header: () => <Header text={t.roleModuleElements.columns.moduleName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Icon",
        id: "Icon",
        header: () => <Header text={t.roleModuleElements.columns.icon} />,
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
        filterFn: "equalsString",
      },
      {
        accessorKey: "Path",
        id: "Path",
        header: () => <Header text={t.roleModuleElements.columns.path} />,
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const columnsModuleElementsExtended = useMemo<
    ColumnDef<RoleModuleElemensByRole, any>[]
  >(
    () => [
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
        accessorKey: "Icon",
        id: "Icon",
        header: () => <Header text={t.roleModuleElements.columns.icon} />,
        filterFn: "equalsString",
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
        accessorKey: "Path",
        id: "Path",
        header: () => <Header text={t.roleModuleElements.columns.path} />,
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const deleteRoleModuleElement = async (roleModuleElementId: number) => {
    try {
      const roleModuleElementsToDelete = {
        RoleId: roleModuleElementId,
      };
      const response = await deleteRoleModuleElementCommand(
        roleModuleElementsToDelete,
      );

      if (!response) {
        throw new Error(`${t.roleModuleElements.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.roleModuleElements.notifications.deleteSuccess}`,
        description: `${t.roleModuleElements.title} : ${roleModuleElementsData.find((x) => x.RoleId === roleModuleElementId)?.RoleName}`,
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
        expandable
        expandedContent={(row) => (
          <>
            <Table
              columns={columnsModulesExtended}
              data={row.Modules}
              pageSizeParam={row.Modules.length}
              minimalMode
              noBorders
            />
            <Table
              columns={columnsModuleElementsExtended}
              data={row.ModuleElements}
              pageSizeParam={row.ModuleElements.length}
              minimalMode
              noBorders
            />
          </>
        )}
        // onRowClick={(row) =>
        //   router.push(
        //     `/settings/roleModuleElements/${row.RoleModuleElementId}?action="view"`,
        //   )
        // }
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
