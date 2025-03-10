import getAllCoursesQuery from "@/repositories/courses/queries/getAllCoursesQuery";
import TeacherCoursesForm from "@/components/teacherCourses/teacherCoursesForm";
import getTeacherCoursesByIdQuery from "@/repositories/teacherCourses/queries/getTeacherCoursesByIdQuery";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let teacherCourses;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  if (params.id != "create") {
    teacherCourses = await getTeacherCoursesByIdQuery({
      UserId: Number(params.id),
    });
  } else {
    teacherCourses = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.teacherCourses.teacherCourses} 
    ${action != "create" ? `: ${teacherCourses ? teacherCourses.UserName : ""}` : ""}`}`;

  const period = searchParams?.period
    ? parseInt(searchParams.period as string)
    : 4;

  const courses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: period,
  });
  const allCourses = await getAllCoursesQuery({
    IsEnabled: true,
    Period: 0,
  });

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <TeacherCoursesForm
            teacherCoursesData={teacherCourses}
            courses={courses}
            allCourses={allCourses}
            action={action}
          />
        </div>
        {/* <pre>{JSON.stringify(teacherCourses, null, 2)}</pre> */}
      </div>
    </div>
  );
}
