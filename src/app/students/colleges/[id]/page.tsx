import getCollegeByIdQuery from "@/repositories/colleges/queries/getCollegeByIdQuery";
import CollegeForm from "@/components/colleges/collegeForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import frFR from "@/lang/fr-FR";

export default async function College({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  let college;

  if (params.id !== "create") {
    college = await getCollegeByIdQuery({
      CollegeId: Number(params.id),
    });
  } else {
    college = null;
  }

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/students/colleges?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="relative mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.colleges.college}</span>
        </div>
        <CollegeForm
          collegeData={college}
          pageIndexParam={pageIndexParam}
          pageSizeParam={pageSizeParam}
          action={action}
          urlParams={searchParams}
        />
      </div>
    </main>
  );
}
