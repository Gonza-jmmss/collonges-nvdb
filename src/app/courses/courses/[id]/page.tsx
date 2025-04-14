import getCourseByIdQuery from "@/repositories/courses/queries/getCourseByIdQuery";
import CourseForm from "@/components/courses/courseForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let course;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const periodNumberParam = searchParams.periodNumber
    ? parseInt(searchParams.periodNumber as string)
    : 4;
  const isEnabledParam =
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  if (params.id != "create") {
    course = await getCourseByIdQuery(Number(params.id));
  } else {
    course = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.courses.course} 
    ${action != "create" ? `: ${course ? course.Name : ""}` : ""}`}`;

  return (
    <div className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/courses/courses?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&periodNumber=${periodNumberParam}&isEnabled=${isEnabledParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="mt-3 w-[70vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <CourseForm
            courseData={course}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
            urlParams={searchParams}
          />
        </div>
        {/* <pre>{JSON.stringify(module, null, 2)}</pre> */}
      </div>
    </div>
  );
}
