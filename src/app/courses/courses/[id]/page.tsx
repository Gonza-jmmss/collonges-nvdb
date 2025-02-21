import getCourseByIdQuery from "@/repositories/courses/queries/getCourseByIdQuery";
import CourseForm from "@/components/courses/courseForm";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let course;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    course = await getCourseByIdQuery(Number(params.id));
  } else {
    course = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.courses.course} 
    ${action != "create" ? `: ${course ? course.Name : ""}` : ""}`}`;

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <CourseForm courseData={course} action={action} />
        </div>
        {/* <pre>{JSON.stringify(module, null, 2)}</pre> */}
      </div>
    </div>
  );
}
