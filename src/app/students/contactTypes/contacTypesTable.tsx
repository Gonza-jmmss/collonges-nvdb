"use client";

import { useState, useMemo } from "react";
import deletePersonContactTypeCommand from "@/repositories/personContactTypes/commands/deletePersonContactTypeCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import DeleteModal from "@/components/common/deleteModal";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ContactTypeViewModel } from "@/repositories/personContactTypes/peronContactTypesViewModel";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function ContactTypesTable({
  contactTypesData,
  pageIndex,
  pageSize,
  urlParams,
}: {
  contactTypesData: ContactTypeViewModel[];
  pageIndex: number;
  pageSize: number;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const getPageIndexParam = searchParams.get("pageIndex");
  const getPageSizeParam = searchParams.get("pageSize");

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModalValidation, setOpenDeleteModalValidation] =
    useState(false);
  const [selectedContactTypeToDelete, setSelectedContactTypeToDelete] =
    useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedContactTypeToDelete(0);
  };

  const deleteContactTypeCondition = (
    contactType: ContactTypeViewModel | null,
  ) => {
    return contactType ? contactType.IsDeletable : false;
  };

  const columns = useMemo<ColumnDef<ContactTypeViewModel, any>[]>(
    () => [
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.contactTypes.columns.name} />,
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
            <>
              <Icon
                name="MdEdit"
                className="cursor-pointer text-xl hover:text-primary"
                onClick={() =>
                  router.push(
                    `/students/contactTypes/${row.row.original.ContactTypeId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}`,
                  )
                }
              />
              {deleteContactTypeCondition(row.row.original) ? (
                <>
                  <Icon
                    name={"MdDelete"}
                    className={
                      "cursor-pointer text-xl text-primary hover:text-destructive"
                    }
                    onClick={() => {
                      setOpenModal(true);
                      setSelectedContactTypeToDelete(
                        row.row.original.ContactTypeId,
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <Icon
                    name={"MdDelete"}
                    className="cursor-pointer text-xl hover:text-primary"
                    onClick={() => {
                      setOpenDeleteModalValidation(true);
                    }}
                  />
                </>
              )}
            </>
          </div>
        ),
      },
    ],
    [getPageIndexParam, getPageSizeParam],
  );

  const disableStudent = async (ContactTypeId: number) => {
    try {
      const ContactTypeToDelete = { ContactTypeId: ContactTypeId };
      const response =
        await deletePersonContactTypeCommand(ContactTypeToDelete);

      if (!response) {
        throw new Error(`${t.contactTypes.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.contactTypes.notifications.deleteSuccess}`,
        description: `${t.contactTypes.contactType} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.contactTypes.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end space-x-5">
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(
              `/students/contactTypes/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}`,
            )
          }
        >
          <span>{t.contactTypes.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={contactTypesData}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        onRowClick={(row) =>
          router.push(
            `/students/contactTypes/${row.ContactTypeId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.contactTypes.deleteModal.title}
        descriptionText={t.contactTypes.deleteModal.description}
        deletefunction={() => disableStudent(selectedContactTypeToDelete)}
        disable
      />
      <Modal
        openModal={openDeleteModalValidation}
        closeModal={() => setOpenDeleteModalValidation(false)}
      >
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="mt-2 text-lg font-semibold">{`${t.contactTypes.deleteModalValidation.title}`}</div>
          <div>{`${t.contactTypes.deleteModalValidation.description}`}</div>
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
