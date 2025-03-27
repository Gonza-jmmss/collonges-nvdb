import getStudentCourseGradesByCourseIdQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradesByCourseIdQuery";
import getAllGradeCoefficientsQuery from "@/repositories/gradeCoefficients/queries/getAllGradeCoefficientsQuery";
import StudentCourseGradesForm from "@/components/studentCourseGrades/studentCourseGradesFrom";
import getCoursesByTeacherQuery from "@/repositories/courses/queries/getCoursesByTeacherQuery";
import getCurrentLevelsQuery from "@/repositories/levels/queries/getCurrentLevelsQuery";
import getStudentsByCourseIdQuery from "@/repositories/studentCourses/queries/getStudentsByCourseIdQuery";
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

  let studentCourseGrade;

  const action = (searchParams.action as string).replace(/"/g, "");
  const periodIdParam = parseInt(searchParams.periodId as string);
  // const levelIdParam = parseInt(searchParams.levelId as string) || null;
  const levelIdParam = parseInt(searchParams.levelId as string) || null;

  const courseIdParam = parseInt(searchParams.courseId as string);

  const descriptionParam = searchParams.description as string;
  const createdAtParam = new Date(searchParams.createdAt as string);

  if (params.id != "create") {
    studentCourseGrade = await getStudentCourseGradesByCourseIdQuery({
      CourseId: courseIdParam,
      Description: descriptionParam,
      CreatedAt: createdAtParam,
    });
  } else {
    studentCourseGrade = null;
  }

  const courses = await getCoursesByTeacherQuery({
    IsEnabled: true,
    Period: periodIdParam,
    RoreName: session ? session.user.userData.Roles.Name : "",
    UserId: session ? parseInt(session.user.id) : 0,
    LevelId: levelIdParam,
  });

  const levels = await getCurrentLevelsQuery();

  const studentByCouse = await getStudentsByCourseIdQuery({
    CourseId: courseIdParam,
  });

  const gradeCoefficients = await getAllGradeCoefficientsQuery({
    IsEnabled: true,
  });

  //   const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourseGrades.studentCourseGrade}
  //     ${action != "create" ? `: ${studentCourseGrade ? studentCourseGrade.Name : ""}` : ""}`}`;
  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.studentCourseGrades.studentCourseGrades} 
    ${action != "create" ? `: ${action == "edit" ? descriptionParam : t.studentCourseGrades.create}` : ""}`}`;

  return (
    <div className="mt-5 flex justify-center">
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
            action={action}
            tearcherId={session ? parseInt(session.user.id) : 0}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(studentCourseGrade, null, 2)}</pre> */}
      </div>
    </div>
  );
}
