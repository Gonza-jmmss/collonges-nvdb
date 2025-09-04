import getStudentCourseGradesByCourseIdQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradesByCourseIdQuery";
import getAllGradeCoefficientsQuery from "@/repositories/gradeCoefficients/queries/getAllGradeCoefficientsQuery";
import StudentCourseGradesForm from "@/components/studentCourseGrades/studentCourseGradesFrom";
import getCoursesByTeacherQuery from "@/repositories/courses/queries/getCoursesByTeacherQuery";
import getCurrentLevelsQuery from "@/repositories/levels/queries/getCurrentLevelsQuery";
import getStudentsByCourseIdQuery from "@/repositories/studentCourses/queries/getStudentsByCourseIdQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import { auth } from "@/utils/auth";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const session = await auth();

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  let studentCourseGrade;

  const action = (searchParams.action as string).replace(/"/g, "");
  const periodNumberParam = parseInt(searchParams.periodNumber as string);
  // const levelIdParam = parseInt(searchParams.levelId as string) || null;
  const levelIdParam = parseInt(searchParams.levelId as string) || null;

  const courseIdParam = parseInt(searchParams.courseId as string);

  const descriptionParam = searchParams.description as string;
  const activityDateParam = new Date(searchParams.activityDate as string);
  const tabParam = searchParams.tab as string;

  if (params.id !== "create") {
    studentCourseGrade = await getStudentCourseGradesByCourseIdQuery({
      CourseId: courseIdParam,
      Description: descriptionParam,
      ActivityDate: activityDateParam,
    });
  } else {
    studentCourseGrade = null;
  }

  const courses = await getCoursesByTeacherQuery({
    IsEnabled: true,
    Period: periodNumberParam,
    RoreName: session ? session.user.userData.Roles.Name : "",
    UserId: session ? parseInt(session.user.id) : 0,
    LevelId: levelIdParam,
  });

  const levels = await getCurrentLevelsQuery();

  const studentByCouse = await getStudentsByCourseIdQuery({
    CourseId: courseIdParam,
    PeriodNumber: periodNumberParam,
  });

  const gradeCoefficients = await getAllGradeCoefficientsQuery({
    IsEnabled: true,
    CoefficientPeriod: periodNumberParam === 4 ? 1 : 0,
  });

  //   const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourseGrades.studentCourseGrade}
  //     ${action != "create" ? `: ${studentCourseGrade ? studentCourseGrade.Name : ""}` : ""}`}`;
  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourseGrades.studentCourseGrades} 
    ${action != "create" ? `: ${action == "edit" ? descriptionParam : t.studentCourseGrades.create}` : ""}`}`;

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&periodNumber=${periodNumberParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}&tab=${tabParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      {/* <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md lg:w-[50vw]"> */}
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <StudentCourseGradesForm
            studentCourseGradeData={studentCourseGrade}
            courses={courses}
            levels={levels}
            studentByCouse={studentByCouse}
            gradeCoefficients={gradeCoefficients}
            tearcherId={session ? parseInt(session.user.id) : 0}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(studentCourseGrade, null, 2)}</pre>
        <pre>{JSON.stringify(studentByCouse, null, 2)}</pre> */}
      </div>
    </main>
  );
}
