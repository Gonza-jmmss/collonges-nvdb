"use client";

import { useState, useMemo } from "react";
import disableStudentCommand from "@/repositories/students/commands/disableStudentCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import ToggleButton from "@/components/common/toggleButton";
import DeleteModal from "@/components/common/deleteModal";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useToast } from "@/hooks/use-toast";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { StudentsViewModel } from "@/repositories/students/studentsViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentsTable({
  studentsData,
  urlParams,
}: {
  studentsData: StudentsViewModel[];
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();
  const updateQuery = useUpdateQuery();

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudentToDelete, setSelectedStudentToDelete] = useState(0);

  const [showEnabledFilter, setShowEnabledFilter] = useState(
    urlParams?.isEnabled === "false" ? false : true || true,
  );

  const closeModal = () => {
    setOpenModal(false);
    setSelectedStudentToDelete(0);
  };

  const columns = useMemo<ColumnDef<StudentsViewModel, any>[]>(
    () => [
      {
        accessorKey: "StudentId",
        id: "StudentId",
        header: () => <Header text={t.students.columns.id} />,
        filterFn: "equalsString",
        size: 30,
      },
      {
        accessorKey: "DBaseCode",
        id: "DBaseCode",
        header: () => <Header text={t.students.columns.dBaseCode} />,
        filterFn: "equalsString",
        size: 70,
      },
      {
        accessorKey: "StudentName",
        id: "StudentName",
        header: () => <Header text={t.students.columns.studentName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsACA",
        id: "IsACA",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.students.columns.isACA} />,
        filterFn: "includesStringSensitive",
        size: 30,
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.students.columns.isEnabled} />,
        filterFn: "includesStringSensitive",
        size: 30,
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
              name={
                isValidIconName("MdEdit") ? "MdEdit" : "MdOutlineNotInterested"
              }
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/students/${row.row.original.StudentId}?action="edit"`,
                )
              }
            />
            {row.row.original.IsEnabled === true && (
              <Icon
                name={
                  isValidIconName("MdDelete")
                    ? "MdDelete"
                    : "MdOutlineNotInterested"
                }
                className="cursor-pointer text-xl hover:text-primary"
                onClick={() => {
                  setOpenModal(true);
                  setSelectedStudentToDelete(row.row.original.StudentId);
                }}
              />
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const disableStudent = async (StudentId: number) => {
    try {
      const StudentToDelete = { StudentId: StudentId };
      const response = await disableStudentCommand(StudentToDelete);

      if (!response) {
        throw new Error(`${t.students.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.students.notifications.deleteSuccess}`,
        description: `${t.students.student} : ${response.Person.FirstName} ${response.Person.LastName}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.students.notifications.deleteError}`,
        description: `${error}`,
      });
    }
  };

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    // Use router.push or history.pushState depending on your navigation setup
    // router.push(newUrl);
    // or
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
          onClick={() => router.push(`/students/create?action="create"`)}
        >
          <span>{t.students.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={studentsData}
        className=""
        onRowClick={(row) =>
          router.push(`/students/${row.StudentId}?action="view"`)
        }
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.users.deleteModal.title}
        descriptionText={t.users.deleteModal.description}
        deletefunction={() => disableStudent(selectedStudentToDelete)}
        disable
      />
    </div>
  );
}
