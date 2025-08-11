import StudentAttendancesByCourseTable from "./studentAttendancesByCourseTable";
import StudentAttendancesByDayTable from "./studentAttendancesByDayTable";
import getStudentCourseAttendancesByCourseAndStudentIdQuery from "@/repositories/studentCourseAttendances/queries/getStudentCourseAttendancesByCourseAndStudentIdQuery";
import getStudentCourseAttendancesByDayAndStudentIdQuery from "@/repositories/studentCourseAttendances/queries/getStudentCourseAttendancesByDayAndStudentIdQuery";
import getCurrentScholarPeriodQuery from "@/repositories/scholarPeriods/queries/getCurrentScholarPeriod";
import {
  StudentCourseAttendancesByDayAndStudentIdViewModel,
  StudentCourseAttendancesByCourseAndStudentIdViewModel,
} from "@/repositories/studentCourseAttendances/StudentCourseAttendancesViewModel";
import { TabsComponent } from "@/components/common/tabs";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";
import { auth } from "@/utils/auth";

export default async function StudentAttendancesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const session = await auth();

  const pageIndex = searchParams?.pageIndex
    ? parseInt(searchParams.pageIndex as string)
    : 0;

  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 10;

  const attendanceDateParam = searchParams.attendanceDate
    ? new Date(searchParams.attendanceDate as string)
    : new Date();

  const currentScholarPeriod = await getCurrentScholarPeriodQuery();

  const periodNumberSelected = searchParams?.periodNumber
    ? parseInt(searchParams.periodNumber as string)
    : currentScholarPeriod.Number;

  let attendacesByCourse: StudentCourseAttendancesByCourseAndStudentIdViewModel[] =
    [];
  let attendacesByDay: StudentCourseAttendancesByDayAndStudentIdViewModel[] =
    [];

  if (session && session.user.userData.StudentId !== null) {
    attendacesByCourse =
      await getStudentCourseAttendancesByCourseAndStudentIdQuery({
        StudentId: session.user.userData.StudentId,
        PeriodNumber: periodNumberSelected,
      });
    attendacesByDay = await getStudentCourseAttendancesByDayAndStudentIdQuery({
      StudentId: session.user.userData.StudentId,
      AttendanceDate: attendanceDateParam,
      PeriodNumber: periodNumberSelected,
    });
  }

  const tabs = [
    {
      id: "StudentAttendancesByCourseTable",
      title: t.studentAttendances.tabs.orderedByCourse,
      body: (
        <StudentAttendancesByCourseTable
          attendancesData={attendacesByCourse}
          urlParams={searchParams}
        />
      ),
    },
    {
      id: "StudentAttendancesByDayTable",
      title: t.studentAttendances.tabs.orderedByDay,
      body: (
        <StudentAttendancesByDayTable
          attendancesData={attendacesByDay}
          selectedAttendanceDate={attendanceDateParam}
          periodNumberSelected={periodNumberSelected}
          tabValue="StudentAttendancesByDayTable"
          pageIndex={pageIndex}
          pageSize={pageSize}
          urlParams={searchParams}
        />
      ),
    },
  ];

  const tabSelected = searchParams?.tab
    ? (searchParams.tab as string)
    : tabs[0].id;

  return (
    <main className="mt-3 w-[92vw] sm:w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/studentHome`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">
          {t.studentAttendances.title}
        </span>
      </div>
      <TabsComponent
        tabs={tabs}
        className="mt-5 w-full"
        tabListClassName="w-[20rem] sm:w-[30rem]"
        defaultValue={tabSelected}
      />
      {/* <pre>{JSON.stringify(attendaces, null, 2)}</pre> */}
    </main>
  );
}
