"use client";

import { useState, useMemo } from "react";
import deleteCollegeCommand from "@/repositories/colleges/commands/deleteCollegeCommand";
import { CollegeViewModel } from "@/repositories/colleges/collegesViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import DeleteModal from "@/components/common/deleteModal";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function CollegesTable({
  colleges,
  pageIndex,
  pageSize,
  urlParams,
}: {
  colleges: CollegeViewModel[];
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
  const [selectedCollegeToDelete, setSelectedCollegeToDelete] = useState(0);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedCollegeToDelete(0);
  };

  const deleteCollegeCondition = (college: CollegeViewModel | null) => {
    return college ? college.IsDeletable : false;
  };

  const columns = useMemo<ColumnDef<CollegeViewModel, any>[]>(
    () => [
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.colleges.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Abbreviation",
        id: "Abbreviation",
        header: () => <Header text={t.colleges.columns.abbreviation} />,
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
                    `/students/colleges/${row.row.original.CollegeId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}`,
                  )
                }
              />
              {deleteCollegeCondition(row.row.original) ? (
                <>
                  <Icon
                    name={"MdDelete"}
                    className={
                      "cursor-pointer text-xl text-primary hover:text-destructive"
                    }
                    onClick={() => {
                      setOpenModal(true);
                      setSelectedCollegeToDelete(row.row.original.CollegeId);
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

  const deleteCollege = async (collegeId: number) => {
    try {
      const CollegeToDelete = { CollegeId: collegeId };
      const response = await deleteCollegeCommand(CollegeToDelete);

      if (!response) {
        throw new Error(`${t.colleges.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.colleges.notifications.deleteSuccess}`,
        description: `${t.colleges.college} : ${response.Name}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.colleges.notifications.deleteError}`,
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
              `/students/colleges/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}`,
            )
          }
        >
          <span>{t.colleges.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={colleges}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        onRowClick={(row) =>
          router.push(
            `/students/colleges/${row.CollegeId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}`,
          )
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.colleges.deleteModal.title}
        descriptionText={t.colleges.deleteModal.description}
        deletefunction={() => deleteCollege(selectedCollegeToDelete)}
        disable
      />
      <Modal
        openModal={openDeleteModalValidation}
        closeModal={() => setOpenDeleteModalValidation(false)}
      >
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="mt-2 text-lg font-semibold">{`${t.colleges.deleteModalValidation.title}`}</div>
          <div>{`${t.colleges.deleteModalValidation.description}`}</div>
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
