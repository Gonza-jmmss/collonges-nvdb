"use client";

import { useState, useMemo } from "react";
import deleteSidebarElementCommand from "@/repositories/sidebarElements/commands/deleteSidebarElementCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import DeleteModal from "@/components/common/deleteModal";
import Link from "next/link";
import { SidebarElementsViewModel } from "@/repositories/sidebarElements/sidebarElementsViewModel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function SidebarElementsTable({
  sidebarElementsData,
}: {
  sidebarElementsData: SidebarElementsViewModel[];
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

  const columns = useMemo<ColumnDef<SidebarElementsViewModel, any>[]>(
    () => [
      {
        accessorKey: "SidebarElementId",
        id: "SidebarElementId",
        header: () => (
          <Header text={t.sidebarElements.columns.sidebarElementId} />
        ),
        size: 30,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.sidebarElements.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Path",
        id: "Path",
        header: () => <Header text={t.sidebarElements.columns.path} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Icon",
        id: "Icon",
        header: () => <Header text={t.sidebarElements.columns.icon} />,
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
        header: () => <Header text={t.sidebarElements.columns.moduleName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Location",
        id: "Location",
        header: () => <Header text={t.sidebarElements.columns.location} />,
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
              href={`/settings/sidebarElements/${row.row.original.SidebarElementId}?action="edit"`}
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
                  row.row.original.SidebarElementId,
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

  const deleteSidebarElement = async (sidebarElementId: number) => {
    try {
      const sidebarElementToDelete = { SidebarElementId: sidebarElementId };
      const response = await deleteSidebarElementCommand(
        sidebarElementToDelete,
      );

      if (!response) {
        throw new Error(`${t.sidebarElements.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.sidebarElements.notifications.deleteSuccess}`,
        description: `${t.sidebarElements.title} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.sidebarElements.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div className="">
      <Table
        columns={columns}
        data={sidebarElementsData}
        className=""
        onRowClick={(row) =>
          router.push(
            `/settings/sidebarElements/${row.SidebarElementId}?action="view"`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.sidebarElements.deleteModal.title}
        descriptionText={t.sidebarElements.deleteModal.description}
        deletefunction={() =>
          deleteSidebarElement(selectedSidebarElementToDelete)
        }
      />
    </div>
  );
}
