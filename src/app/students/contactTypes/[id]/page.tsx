import getPersonContactTypeByIdQuery from "@/repositories/personContactTypes/queries/getPersonContactTypeByIdQuery";
import ContactTypeForm from "@/components/contactType/contactTypeForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import frFR from "@/lang/fr-FR";

export default async function ContactType({
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

  let contactType;

  if (params.id !== "create") {
    contactType = await getPersonContactTypeByIdQuery({
      ContactTypeId: Number(params.id),
    });
  } else {
    contactType = null;
  }

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/students/contactTypes?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="relative mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">
            {t.contactTypes.contactType}
          </span>
        </div>
        <ContactTypeForm
          contactTypeData={contactType}
          pageIndexParam={pageIndexParam}
          pageSizeParam={pageSizeParam}
          action={action}
          urlParams={searchParams}
        />
      </div>
    </main>
  );
}
