import AttendancesByDayTable from "./attendancesByDayTable";
import AttendancesByStudentTable from "./attendancesByStudentTable";
import getCoursesByTeacherQuery from "@/repositories/courses/queries/getCoursesByTeacherQuery";
import getCurrentScholarPeriodQuery from "@/repositories/scholarPeriods/queries/getCurrentScholarPeriod";
import getStudentCourseAttendancesByDayQuery from "@/repositories/studentCourseAttendances/queries/getStudentCourseAttendancesByDayQuery";
import getStudentCourseAttendancesByStudentQuery from "@/repositories/studentCourseAttendances/queries/getStudentCourseAttendancesByStudentQuery";
import getAllScholarPeriodsTableQuery from "@/repositories/scholarPeriods/queries/getAllScholarPeriodsTableQuery";
import { TabsComponent } from "@/components/common/tabs";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function StudentCourseAttendacesPage({
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

  const levelIdSelected = searchParams?.levelId
    ? searchParams.levelId !== "null"
      ? parseInt(searchParams.levelId as string)
      : null
    : null;

  // const currentScholarPeriod = await getCurrentScholarPeriodQuery();

  // const periodNumberSelected = searchParams?.periodNumber
  //   ? parseInt(searchParams.periodNumber as string)
  //   : currentScholarPeriod.Number;

  const scholarPeriods = await getAllScholarPeriodsTableQuery();

  const scholarPeriodIdParam =
    searchParams.scholarPeriodId && searchParams.scholarPeriodId !== "null"
      ? parseInt(searchParams.scholarPeriodId as string)
      : scholarPeriods[0].ScholarPeriodId;

  const periodNumberSelected =
    scholarPeriods.find((x) => x.ScholarPeriodId === scholarPeriodIdParam)
      ?.Number ?? scholarPeriods[0].Number;

  const courses = await getCoursesByTeacherQuery({
    IsEnabled: true,
    // Period: periodNumberSelected,
    Period: periodNumberSelected,
    RoreName: session ? session.user.userData.Roles.Name : "",
    UserId: session ? parseInt(session.user.id) : 0,
    LevelId: levelIdSelected,
  });

  const courseIdSelected =
    searchParams?.courseId === undefined || searchParams?.courseId === "0"
      ? courses.length > 0
        ? courses[0].CourseId
        : 0
      : parseInt(searchParams.courseId as string);

  const studentCourseAttendanceByDay =
    await getStudentCourseAttendancesByDayQuery({
      AttendanceDate: attendanceDateParam,
      // PeriodNumber: periodNumberSelected,
      // ScholarPeriodId: scholarPeriodIdParam,
    });

  const studentCourseAttendanceByStudent =
    await getStudentCourseAttendancesByStudentQuery({
      // PeriodNumber: periodNumberSelected,
      ScholarPeriodId: scholarPeriodIdParam,
    });

  const tabs = [
    {
      id: "StudentCourseAttendancesByDayTable",
      title: t.studentCourseAttendances.tabs.orderedByDay,
      body: (
        <AttendancesByDayTable
          attendancesData={studentCourseAttendanceByDay}
          selectedAttendanceDate={attendanceDateParam}
          // periodNumberSelected={periodNumberSelected}
          // scholarPeriods={scholarPeriods}
          scholarPeriodSelected={scholarPeriodIdParam}
          courseIdSelected={courseIdSelected}
          tabValue="StudentCourseAttendancesByDayTable"
          pageIndex={pageIndex}
          pageSize={pageSize}
          urlParams={searchParams}
        />
      ),
    },
    {
      id: "StudentCourseAttendancesByStudentTable",
      title: t.studentCourseAttendances.tabs.orderedByStudent,
      body: (
        <AttendancesByStudentTable
          attendancesData={studentCourseAttendanceByStudent}
          // periodNumberSelected={periodNumberSelected}
          scholarPeriods={scholarPeriods}
          scholarPeriodSelected={scholarPeriodIdParam}
          tabValue="StudentCourseAttendancesByStudentTable"
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
    <main className="relative mt-3 w-[80vw]">
      <Button asChild className={`absolute -left-16 -top-1`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">
          {t.studentCourseAttendances.title}
        </span>
      </div>
      <TabsComponent
        tabs={tabs}
        className="mt-5 w-full"
        tabListClassName="w-[30rem]"
        defaultValue={tabSelected}
      />
      {/* <pre>{JSON.stringify(attendances, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(studentCourseAttendanceByStudent, null, 2)}</pre> */}
    </main>
  );
}
