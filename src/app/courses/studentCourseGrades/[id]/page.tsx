import getStudentCourseGradesByCourseIdQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradesByCourseIdQuery";
import getAllGradeCoefficientsQuery from "@/repositories/gradeCoefficients/queries/getAllGradeCoefficientsQuery";
import StudentCourseGradesForm from "@/components/studentCourseGrades/studentCourseGradesFrom";
import getCoursesByTeacherQuery from "@/repositories/courses/queries/getCoursesByTeacherQuery";
// import getCurrentLevelsQuery from "@/repositories/levels/queries/getCurrentLevelsQuery";
import getAllLevelsQuery from "@/repositories/levels/queries/getAllLevelsQuery";
import getStudentsByCourseIdQuery from "@/repositories/studentCourses/queries/getStudentsByCourseIdQuery";
import getAllScholarPeriodsTableQuery from "@/repositories/scholarPeriods/queries/getAllScholarPeriodsTableQuery";
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
  // const periodNumberParam = parseInt(searchParams.periodNumber as string);
  const scholarPeriodIdParam = parseInt(searchParams.scholarPeriodId as string);
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

  const scholarPeriods = await getAllScholarPeriodsTableQuery();

  const periodNumberSelected =
    scholarPeriods.find((x) => x.ScholarPeriodId === scholarPeriodIdParam)
      ?.Number ?? scholarPeriods[0].Number;

  const courses = await getCoursesByTeacherQuery({
    IsEnabled: true,
    Period: periodNumberSelected,
    // Period: periodNumberParam,
    RoreName: session ? session.user.userData.Roles.Name : "",
    UserId: session ? parseInt(session.user.id) : 0,
    LevelId: levelIdParam,
  });

  // const levels = await getCurrentLevelsQuery();
  const levels = await getAllLevelsQuery({
    IsEnabled: true,
    PeriodNumber: periodNumberSelected,
  });

  // const studentByCouse = await getStudentsByCourseIdQuery({
  //   CourseId: courseIdParam,
  //   PeriodNumber: periodNumberParam,
  //   Action: action,
  // });
  const studentByCouse =
    action === "create"
      ? await getStudentsByCourseIdQuery({
          CourseId: courseIdParam,
          PeriodNumber: periodNumberSelected,
          // PeriodNumber: periodNumberParam,
          Action: action,
        })
      : await getStudentsByCourseIdQuery({
          CourseId: courseIdParam,
          PeriodNumber: periodNumberSelected,
          // PeriodNumber: periodNumberParam,
          Action: action,
          Description: descriptionParam,
        });

  const gradeCoefficients = await getAllGradeCoefficientsQuery({
    IsEnabled: true,
    CoefficientPeriod: periodNumberSelected === 4 ? 1 : 0,
    // CoefficientPeriod: periodNumberParam === 4 ? 1 : 0,
  });

  //   const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourseGrades.studentCourseGrade}
  //     ${action != "create" ? `: ${studentCourseGrade ? studentCourseGrade.Name : ""}` : ""}`}`;
  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourseGrades.studentCourseGrades} 
    ${action != "create" ? `: ${action == "edit" ? descriptionParam : t.studentCourseGrades.create}` : ""}`}`;

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`}
          // href={`/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&periodNumber=${periodNumberParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`}
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
            scholarPeriods={scholarPeriods}
            studentByCouse={studentByCouse}
            gradeCoefficients={gradeCoefficients}
            tearcherId={session ? parseInt(session.user.id) : 0}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* studentCourseGrade
        <pre>{JSON.stringify(studentCourseGrade, null, 2)}</pre>
        scholarPeriodIdParam
        <pre>{JSON.stringify(scholarPeriodIdParam, null, 2)}</pre>
        periodNumberSelected
        <pre>{JSON.stringify(periodNumberSelected, null, 2)}</pre>
        studentByCouse
        <pre>{JSON.stringify(studentByCouse, null, 2)}</pre> */}
      </div>
    </main>
  );
}
