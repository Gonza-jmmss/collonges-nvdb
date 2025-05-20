"use client";

import { useMemo } from "react";
import {
  StudentCourseGradesByStudentIdViewModel,
  StudentCourseGradesExtendedViewModel,
} from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import formatDate from "@/functions/formatDate";
import frFR from "@/lang/fr-FR";

export default function StudentCourses({
  courses,
}: {
  courses: StudentCourseGradesByStudentIdViewModel[];
}) {
  const t = frFR;

  const columns = useMemo<
    ColumnDef<StudentCourseGradesByStudentIdViewModel, any>[]
  >(
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
            {row.original.StudentCourseGrades.length > 0 &&
            row.getCanExpand() ? (
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
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => <Header text={t.studentProfile.columns.courseName} />,
        filterFn: "equalsString",
        size: 300,
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => <Header text={t.studentProfile.columns.courseCode} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "Grade",
        id: "Grade",
        header: () => <Header text={t.studentProfile.columns.grade} />,
        filterFn: "equalsString",
        cell: (row) => (
          <span>{row.getValue() === "NaN" ? "-" : row.getValue()}</span>
        ),
        size: 20,
      },
      {
        accessorKey: "LevelName",
        id: "LevelName",
        header: () => <Header text={t.studentProfile.columns.levelName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "ScholarPeriodName",
        id: "ScholarPeriodName",
        header: () => (
          <Header text={t.studentProfile.columns.scholarPeriodName} />
        ),
        filterFn: "equalsString",
      },
      // {
      //   accessorKey: "ScholarYearName",
      //   id: "ScholarYearName",
      //   header: () => (
      //     <Header text={t.studentProfile.columns.scholarYearName} />
      //   ),
      //   filterFn: "equalsString",
      // },
    ],
    [],
  );

  const columnsExtended = useMemo<
    ColumnDef<StudentCourseGradesExtendedViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "Description",
        id: "Description",
        header: () => <Header text={t.studentProfile.expanded.description} />,
        filterFn: "equalsString",
        size: 200,
      },
      {
        accessorKey: "GradeCoefficientName",
        id: "GradeCoefficientName",
        header: () => (
          <Header text={t.studentProfile.expanded.gradeCoefficientName} />
        ),
        // cell: (row) => (
        //   <span>{`${row.row.original.GradeCoefficientName}, ${row.row.original.GradeCoefficientPercentage}%`}</span>
        // ),
        filterFn: "equalsString",
        size: 100,
      },
      {
        accessorKey: "Grade",
        id: "Grade",
        header: () => <Header text={t.studentProfile.expanded.grade} />,
        cell: (row) => (
          <span>{row.getValue() === "NaN" ? "-" : row.getValue()}</span>
        ),
        filterFn: "equalsString",
        size: 40,
      },
      {
        accessorKey: "ActivityDate",
        id: "ActivityDate",
        header: () => <Header text={t.studentProfile.expanded.activityDate} />,
        filterFn: "equalsString",
        cell: (row) =>
          row.getValue() !== null ? formatDate(row.getValue()) : "",
        size: 40,
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => <Header text={t.studentProfile.expanded.userName} />,
        filterFn: "equalsString",
        size: 40,
      },
    ],
    [],
  );

  const mobileColumns = useMemo<
    ColumnDef<StudentCourseGradesByStudentIdViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => <Header text={t.studentProfile.columns.courseName} />,
        cell: ({ row }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex items-center space-x-3"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.original.StudentCourseGrades.length > 0 &&
              row.getCanExpand() ? (
                <Icon
                  name={`${row.getIsExpanded() ? "MdArrowDownward" : "MdArrowForward"}`}
                  className="cursor-pointer"
                />
              ) : (
                <Icon name="MdHorizontalRule" />
              )}
              <div>
                <div>
                  {/* <span className="text-xs font-semibold">{`${t.studentProfile.columns.courseName.toUpperCase()}: `}</span> */}
                  <span className="text-sm font-semibold">
                    {row.original.CourseName}
                  </span>
                </div>
                <div className="flex space-x-5">
                  <div>
                    <span className="text-xs font-semibold">{`${t.studentProfile.columns.code.toUpperCase()}: `}</span>
                    <span className="text-xs">{row.original.CourseCode}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold">{`${t.studentProfile.columns.grade.toUpperCase()}: `}</span>
                    <span className="text-xs font-semibold text-primary">
                      {row.original.Grade === "NaN" ? "-" : row.original.Grade}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  const mobileColumnsExtended = useMemo<
    ColumnDef<StudentCourseGradesExtendedViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => (
          <div className="w-full">
            <Header text={t.studentProfile.expanded.activities} />
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <div className="flex space-x-5">
              <div>
                <span className="text-xs font-semibold">{`${t.studentProfile.expanded.description.toUpperCase()}: `}</span>
                <span className="text-xs text-primary">
                  {row.original.Description}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold">{`${t.studentProfile.expanded.grade.toUpperCase()}: `}</span>
                <span className="text-xs font-semibold text-primary">
                  {row.original.Grade === "NaN" ? "-" : row.original.Grade}
                </span>
              </div>
            </div>
            <div className="flex space-x-5">
              <div>
                <span className="text-xs font-semibold">{`${t.studentProfile.expanded.gradeCoefficientName.toUpperCase()}: `}</span>
                <span className="text-xs">
                  {row.original.GradeCoefficientName}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold">{`${t.studentProfile.expanded.activityDate.toUpperCase()}: `}</span>
                <span className="text-xs">
                  {row.original.ActivityDate !== null
                    ? formatDate(row.original.ActivityDate)
                    : ""}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold">{`${t.studentProfile.expanded.userName.toUpperCase()}: `}</span>
              <span className="text-xs">{row.original.UserName}</span>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="hidden sm:mt-5 sm:block">
        <div className="text-xl font-semibold">Courses</div>
        <div className="mt-3">
          <Table
            columns={columns}
            data={courses}
            expandable
            minimalMode
            expandedContent={(row) => (
              <Table
                columns={columnsExtended}
                data={row.StudentCourseGrades}
                minimalMode
                noBorders
              />
            )}
          />
        </div>
      </div>
      <div className="mt-5 sm:hidden">
        <div className="text-lg font-semibold">Courses</div>
        <div className="mt-3">
          <Table
            columns={mobileColumns}
            data={courses}
            // pageIndexParam={pageIndex}
            // pageSizeParam={pageSize}
            expandable
            minimalMode
            expandedContent={(row) => (
              <Table
                columns={mobileColumnsExtended}
                data={row.StudentCourseGrades}
                minimalMode
                noBorders
              />
            )}
          />
        </div>
      </div>
    </>
  );
}

// "use client";

// import { useState, useMemo } from "react";
// import deleteStudentCourseGradesCommand from "@/repositories/studentCourseGrades/commands/deleteStudentCourseGradesCommand";
// import {
//   StudentCourseGradesByStudentCourseViewModel,
//   StudentCourseGradesExtendedViewModel,
// } from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";
// import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
// import { CurentLevelsViewModel } from "@/repositories/levels/levelsViewModel";
// import { ColumnDef } from "@tanstack/react-table";
// import Table from "@/components/table/table";
// import Header from "@/components/table/header";
// import { Button } from "@/components/ui/button";
// import Combobox from "@/components/common/combobox";
// import Icon from "@/components/common/icon";
// import enumToArray from "@/functions/enumToArray";
// import formatDate from "@/functions/formatDate";
// import Modal from "@/components/common/modal";
// import { PeriodEnum } from "@/enum/periodEnum";
// import { useUpdateQuery } from "@/hooks/useUpdateQuery";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter, useSearchParams } from "next/navigation";
// import frFR from "@/lang/fr-FR";

// export default function StudentCoruseGradesByStudentTable({
//   studentCourseGradesByStudentCourse,
//   periodNumberSelected,
//   courses,
//   courseIdSelected,
//   levels,
//   levelIdSelected,
//   tabValue,
//   pageIndex,
//   pageSize,
//   urlParams,
// }: {
//   studentCourseGradesByStudentCourse: StudentCourseGradesByStudentCourseViewModel[];
//   periodNumberSelected: number;
//   courses: CourseViewModel[];
//   courseIdSelected: number;
//   levels: CurentLevelsViewModel[];
//   levelIdSelected: number | null;
//   tabValue: string;
//   pageIndex: number;
//   pageSize: number;
//   urlParams?: { [key: string]: string | string[] | undefined };
// }) {
//   const t = frFR;
//   const router = useRouter();
//   const { toast } = useToast();
//   const updateQuery = useUpdateQuery();
//   const searchParams = useSearchParams();

//   const getPageIndexParam = searchParams.get("pageIndex");
//   const getPageSizeParam = searchParams.get("pageSize");

//   const [openModal, setOpenModal] = useState(false);
//   const [
//     selectedStudentCourseGradeToDelete,
//     setSelectedStudentCourseGradeToDelete,
//   ] = useState<StudentCourseGradesExtendedViewModel | null>();

//   const closeModal = () => {
//     setOpenModal(false);
//     setSelectedStudentCourseGradeToDelete(null);
//   };

//   const activityGradesEmptyCondition = (
//     studentCourse: StudentCourseGradesExtendedViewModel,
//   ) => {
//     return !studentCourseGradesByStudentCourse
//       .map((student) => student.StudentCourseGrades)
//       .map(
//         (studentCourseGrade) =>
//           studentCourseGrade.find(
//             (x) => x.Description === studentCourse.Description,
//           )?.Grade,
//       )
//       .some((x) => x !== "NaN");
//   };
//   // const activityGradesEmptyCondition = (
//   //     studentCourseGrade: StudentCourseGradeByActivityViewModel,
//   //   ) => {
//   //     return !studentCourseGrade.Activities.map(
//   //       (activity) => activity.Grade,
//   //     ).some((grade) => grade !== "NaN");
//   //   };

//   const deleteStudentCourseGrades = async (
//     StudentCourseGradeToDelete: StudentCourseGradesExtendedViewModel,
//   ) => {
//     try {
//       const studentCourseGradeIdsToDelete = studentCourseGradesByStudentCourse
//         .map((student) => student.StudentCourseGrades)
//         .map(
//           (StudentCourseGrade) =>
//             StudentCourseGrade.find(
//               (x) => x.Description === StudentCourseGradeToDelete.Description,
//             )?.StudentCourseGradeId,
//         )
//         .filter((x) => x !== undefined);

//       // Delete StudentCourseGrades
//       const response = await deleteStudentCourseGradesCommand(
//         studentCourseGradeIdsToDelete,
//       );

//       if (!response) {
//         throw new Error(`${t.gradeCoefficients.notifications.deleteFailure}`);
//       }

//       toast({
//         title: `${t.gradeCoefficients.notifications.deleteSuccess}`,
//         description: `${t.gradeCoefficients.title} : ${StudentCourseGradeToDelete.Description}`,
//       });

//       router.refresh();
//       closeModal();
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: `${t.gradeCoefficients.notifications.deleteError}`,
//         description: `${error}`,
//       });
//     }
//   };

//   const handleUrlParameterChange = (key: string, value: string) => {
//     const currentParams = new URLSearchParams(window.location.search);
//     currentParams.set(key, value);

//     // Update URL without replacing current parameters
//     const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

//     window.history.pushState({}, "", newUrl);

//     // If you need to update some state as well
//     updateQuery(Object.fromEntries(currentParams));
//   };

//   return (
//     <div>
//       <div className="mt-3 flex items-center justify-between">
//         <div className="-ml-3 flex flex-wrap justify-start space-x-3 space-y-3 xl:flex-row xl:items-center xl:space-y-0">
//           <div />
//           <div className="w-[12rem]">
//             <Combobox
//               options={enumToArray(PeriodEnum).slice(1)}
//               textAttribute="value"
//               valueAttribute="key"
//               placeholder={t.courses.form.periodNumber}
//               itemSelected={enumToArray(PeriodEnum).find(
//                 (x) => x.key === periodNumberSelected,
//               )}
//               setItemSelected={(x: { key: number }) => {
//                 handleUrlParameterChange("periodNumber", `${x.key}`);
//                 handleUrlParameterChange("courseId", `${0}`);
//               }}
//               notClearable
//             />
//           </div>
//           <div className="w-[12rem]">
//             <Combobox
//               options={levels}
//               textAttribute="Name"
//               valueAttribute="LevelId"
//               placeholder={t.studentCourseGrades.level}
//               itemSelected={levels.find((x) => x.LevelId === levelIdSelected)}
//               setItemSelected={(x: CurentLevelsViewModel) => {
//                 handleUrlParameterChange("levelId", `${x ? x.LevelId : null}`);
//                 handleUrlParameterChange("courseId", `${0}`);
//               }}
//             />
//           </div>
//           <div className="w-[28.9rem]">
//             <Combobox
//               options={courses}
//               textAttribute={["CourseCode", "Name"]}
//               valueAttribute="CourseId"
//               placeholder={t.studentCourseGrades.columnsByStudent.courseName}
//               itemSelected={courses.find(
//                 (x) => x.CourseId === courseIdSelected,
//               )}
//               setItemSelected={(x: CourseViewModel) => {
//                 handleUrlParameterChange("courseId", `${x.CourseId}`);
//               }}
//               showSearch
//               notClearable
//             />
//           </div>
//         </div>
//         <Button
//           variant="outlineColored"
//           onClick={() =>
//             router.push(
//               `/courses/studentCourseGrades/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&periodNumber=${periodNumberSelected}&levelId=${levelIdSelected}&courseId=${courseIdSelected}&tab=${tabValue}`,
//             )
//           }
//         >
//           <span>{t.studentCourseGrades.create}</span>
//         </Button>
//       </div>
//       <Table
//         columns={columns}
//         data={studentCourseGradesByStudentCourse}
//         className=""
//         pageIndexParam={pageIndex}
//         pageSizeParam={pageSize}
//         expandable
//         expandedContent={(row) => (
//           <Table
//             columns={columnsExtended}
//             data={row.StudentCourseGrades}
//             minimalMode
//             noBorders
//           />
//         )}
//       />
//       <Modal openModal={openModal} closeModal={closeModal}>
//         <div>
//           {selectedStudentCourseGradeToDelete &&
//             activityGradesEmptyCondition(selectedStudentCourseGradeToDelete) ===
//               false && (
//               <>
//                 <div className="flex w-full flex-col items-center space-y-1">
//                   <div className="mt-2 text-lg font-semibold">{`${t.studentCourseGrades.delteModalValidation.title}`}</div>
//                   <div>{`${t.studentCourseGrades.delteModalValidation.description}`}</div>
//                 </div>
//                 <div className="mt-5 flex w-full justify-center space-x-5">
//                   <Button
//                     type="button"
//                     variant={"secondary"}
//                     className="w-[30%]"
//                     onClick={closeModal}
//                   >
//                     {t.shared.cancel}
//                   </Button>
//                 </div>
//               </>
//             )}
//           {selectedStudentCourseGradeToDelete &&
//             activityGradesEmptyCondition(selectedStudentCourseGradeToDelete) ===
//               true && (
//               <>
//                 <div className="flex w-full flex-col items-center space-y-1">
//                   <div className="mt-2 text-lg font-semibold">{`${t.studentCourseGrades.deleteModal.deleteTitle}`}</div>
//                   <div>{`${t.studentCourseGrades.deleteModal.deleteDescription}`}</div>
//                 </div>
//                 <div className="mt-5 flex w-full justify-center space-x-5">
//                   <Button
//                     type="button"
//                     variant={"secondary"}
//                     className="w-[30%]"
//                     onClick={closeModal}
//                   >
//                     {t.shared.cancel}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant={"default"}
//                     className="w-[30%]"
//                     onClick={() =>
//                       selectedStudentCourseGradeToDelete &&
//                       deleteStudentCourseGrades(
//                         selectedStudentCourseGradeToDelete,
//                       )
//                     }
//                   >
//                     {t.shared.confirm}
//                   </Button>
//                 </div>
//               </>
//             )}
//         </div>
//       </Modal>
//       {/* <pre>{JSON.stringify(studentCourseGradesByStudentCourse, null, 2)}</pre> */}
//     </div>
//   );
// }
