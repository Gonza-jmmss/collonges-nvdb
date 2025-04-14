import StudentCoruseGradesByStudentTable from "./studentCourseGradesByStudentTable";
import StudentCoruseGradesByActivityTable from "./studentCourseGradesByActivityTable";
import getStudentCourseGrandesByStudentCourseQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradesByStudentCourseQuery";
import getStudentCourseGradeByActivityQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradeByActivityQuery";
import getCoursesByTeacherQuery from "@/repositories/courses/queries/getCoursesByTeacherQuery";
import getCurrentLevelsQuery from "@/repositories/levels/queries/getCurrentLevelsQuery";
import { TabsComponent } from "@/components/common/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function StudentCourseGradesPage({
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

  const periodNumberSelected = searchParams?.periodNumber
    ? parseInt(searchParams.periodNumber as string)
    : 4;

  const levelIdSelected = searchParams?.levelId
    ? searchParams.levelId !== "null"
      ? parseInt(searchParams.levelId as string)
      : null
    : null;

  const courses = await getCoursesByTeacherQuery({
    IsEnabled: true,
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

  const studentCourseGradesByStudentCourse =
    await getStudentCourseGrandesByStudentCourseQuery({
      CourseId: courseIdSelected,
    });

  const studentCourseGradesByActivity =
    await getStudentCourseGradeByActivityQuery({
      CourseId: courseIdSelected,
    });

  const levels = await getCurrentLevelsQuery();

  const tabs = [
    {
      id: "StudentCoruseGradesByActivityTable",
      title: t.studentCourseGrades.tabs.orderedByActivity,
      body: (
        <StudentCoruseGradesByActivityTable
          studentCourseGradesByActivity={studentCourseGradesByActivity}
          periodNumberSelected={periodNumberSelected}
          courses={courses}
          courseIdSelected={courseIdSelected}
          levels={levels}
          levelIdSelected={levelIdSelected}
          tabValue="StudentCoruseGradesByActivityTable"
          pageIndex={pageIndex}
          pageSize={pageSize}
          urlParams={searchParams}
        />
      ),
    },
    {
      id: "StudentCoruseGradesByStudentTable",
      title: t.studentCourseGrades.tabs.orderedByStudent,
      body: (
        <StudentCoruseGradesByStudentTable
          studentCourseGradesByStudentCourse={
            studentCourseGradesByStudentCourse
          }
          periodNumberSelected={periodNumberSelected}
          courses={courses}
          courseIdSelected={courseIdSelected}
          levels={levels}
          levelIdSelected={levelIdSelected}
          tabValue="StudentCoruseGradesByStudentTable"
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
      <Button asChild className={`absolute -left-16 top-0`} variant="ghost">
        <Link href={`/courses`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">
          {t.studentCourseGrades.title}
        </span>
      </div>
      <TabsComponent
        tabs={tabs}
        className="mt-5 w-full"
        tabListClassName="w-[30rem]"
        defaultValue={tabSelected}
      />
      {/* <pre>{JSON.stringify(studentCourseGradesByActivity, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(studentCourseGradesByStudentCourse, null, 2)}</pre> */}
    </main>
  );
}
