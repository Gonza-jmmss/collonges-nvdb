"use client";

import { useState, useMemo } from "react";
import StudentUserCreadentialsPDF from "@/components/students/studentUserCredentialsPDF";
import disableStudentCommand from "@/repositories/students/commands/disableStudentCommand";
import createStudentUserCommand from "@/repositories/users/commands/createStudentUserCommand";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import ToggleButton from "@/components/common/toggleButton";
import DeleteModal from "@/components/common/deleteModal";
import Combobox from "@/components/common/combobox";
import Icon from "@/components/common/icon";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { StudentsViewModel } from "@/repositories/students/studentsViewModel";
import { yearPeriodsViewModel } from "@/repositories/yearPeriods/yearPeriodsViewModel";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentsTable({
  studentsData,
  yearPeriods,
  yearPeriodIdSelected,
  isEnabledSelected,
  userRoleName,
  pageIndex,
  pageSize,
  urlParams,
}: {
  studentsData: StudentsViewModel[];
  yearPeriods: yearPeriodsViewModel[];
  yearPeriodIdSelected: number | null;
  isEnabledSelected: boolean;
  userRoleName: string | undefined;
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
  const [selectedStudentToDelete, setSelectedStudentToDelete] = useState(0);
  const [opentCreateStudentUserModal, setOpentCreateStudentUserModal] =
    useState(false);
  const [selectedStudentToCreateUser, setSelectedStudentToCreateUser] =
    useState<StudentsViewModel | null>(null);

  const [showEnabledFilter, setShowEnabledFilter] = useState(
    urlParams?.isEnabled === "false" ? false : true || true,
  );

  const closeModal = () => {
    setOpenModal(false);
    setSelectedStudentToDelete(0);
  };

  const closeCreateStudentUserModal = () => {
    setOpentCreateStudentUserModal(false);
    setSelectedStudentToCreateUser(null);
  };

  const columns = useMemo<ColumnDef<StudentsViewModel, any>[]>(
    () => [
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
        accessorKey: "YearPeriodName",
        id: "YearPeriodName",
        header: () => <Header text={t.students.columns.yearPeriodName} />,
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
        cell: ({ row }) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            {userRoleName !== "Professeur" && (
              <>
                <Icon
                  name="MdEdit"
                  className="cursor-pointer text-xl hover:text-primary"
                  onClick={() =>
                    router.push(
                      `/students/students/${row.original.StudentId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&yearPeriodId=${yearPeriodIdSelected}`,
                    )
                  }
                />
                {row.original.IsEnabled === true && (
                  <Icon
                    name="MdNotInterested"
                    className="cursor-pointer text-xl hover:text-primary"
                    onClick={() => {
                      setOpenModal(true);
                      setSelectedStudentToDelete(row.original.StudentId);
                    }}
                  />
                )}
                {!row.original.HasUser && (
                  <Icon
                    name="MdPersonAdd"
                    className="cursor-pointer text-xl hover:text-primary"
                    onClick={() => {
                      setOpentCreateStudentUserModal(true);
                      setSelectedStudentToCreateUser(row.original);
                    }}
                  />
                )}
              </>
            )}
          </div>
        ),
      },
    ],
    [getPageIndexParam, getPageSizeParam, yearPeriodIdSelected],
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

  const createStudentUser = async (StudentId: number) => {
    try {
      if (StudentId === 0) {
        throw new Error(`${t.students.notifications.studentUserCreateFailure}`);
      }

      const UserStudentToCreate = { StudentId: StudentId };
      const response = await createStudentUserCommand(UserStudentToCreate);

      if (!response) {
        throw new Error(`${t.students.notifications.studentUserCreateFailure}`);
      }
      toast({
        title: `${t.students.notifications.studentUserCreateSuccess}`,
        description: `${t.students.student} : ${response.Person.FirstName} ${response.Person.LastName}`,
      });
      router.refresh();
      closeCreateStudentUserModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.students.notifications.studentUserCreateError}`,
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
        <div className="w-[15rem]">
          <Combobox
            options={yearPeriods}
            textAttribute="Name"
            valueAttribute="YearPeriodId"
            placeholder={t.students.form.yearPeriodId}
            itemSelected={yearPeriods.find(
              (x) => x.YearPeriodId === yearPeriodIdSelected,
            )}
            setItemSelected={(x: { YearPeriodId: number }) => {
              handleUrlParameterChange(
                "yearPeriodId",
                `${x ? x.YearPeriodId : null}`,
              );
            }}
            showSearch
          />
        </div>
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
        {userRoleName !== "Professeur" && (
          <Button
            variant="outlineColored"
            onClick={() =>
              router.push(
                `/students/students/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&yearPeriodId=${yearPeriodIdSelected}`,
              )
            }
          >
            <span>{t.students.create}</span>
          </Button>
        )}
      </div>
      <Table
        columns={columns}
        data={studentsData}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        onRowClick={(row) =>
          router.push(
            `/students/students/${row.StudentId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&isEnabled=${isEnabledSelected}&yearPeriodId=${yearPeriodIdSelected}`,
          )
        }
      />
      {userRoleName !== "Professeur" && (
        <div className="mt-3 flex justify-end">
          <StudentUserCreadentialsPDF studentsData={studentsData} />
        </div>
      )}
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.users.deleteModal.title}
        descriptionText={t.users.deleteModal.description}
        deletefunction={() => disableStudent(selectedStudentToDelete)}
        disable
      />
      <Modal
        openModal={opentCreateStudentUserModal}
        closeModal={closeCreateStudentUserModal}
      >
        <div>
          <div className="flex w-full flex-col items-center space-y-1">
            <div className="text-lg font-semibold">{`${t.students.createStudentUserModal.title} ${selectedStudentToCreateUser?.StudentName} ?`}</div>
            <div>{`${t.students.createStudentUserModal.description}`}</div>
            {/* <div>{`${t.students.student} : ${selectedStudentToCreateUser?.StudentName}`}</div> */}
          </div>
          <div className="mt-5 flex w-full justify-center space-x-5">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={closeCreateStudentUserModal}
            >
              {t.shared.cancel}
            </Button>
            <Button
              type="button"
              variant={"default"}
              className="w-[30%]"
              onClick={() =>
                createStudentUser(selectedStudentToCreateUser?.StudentId || 0)
              }
            >
              {t.shared.create}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
