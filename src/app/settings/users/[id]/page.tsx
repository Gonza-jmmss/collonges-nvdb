import getUserByUserIdQuery from "@/repositories/users/queries/getUserByUserIdQuery";
import getAllRolesQuery from "@/repositories/roles/queries/getAllRolesQuery";
import UserForm from "@/components/users/userForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import frFR from "@/lang/fr-FR";

export default async function UserPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let user;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const pageIndexParam = parseInt(searchParams.pageIndex as string);
  const pageSizeParam = parseInt(searchParams.pageSize as string);

  const isEnabledParam =
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";
  const isStudentParam =
    searchParams.isStudent === undefined
      ? false
      : searchParams.isStudent === "true";

  if (params.id != "create") {
    user = await getUserByUserIdQuery(Number(params.id));
  } else {
    user = null;
  }

  const roles = await getAllRolesQuery();

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.users.user} 
    ${action != "create" ? `: ${user ? user.UserName : ""}` : ""}`}`;

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link
          href={`/settings/users?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}&isStudent=${isStudentParam}`}
        >
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      {/* &isStudent=${isStudentSelected} */}
      <div className="mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-xl font-semibold">
          {pagetitle}
        </div>
        <div className="mt-5">
          <UserForm
            userData={user}
            roles={roles}
            pageIndexParam={pageIndexParam}
            pageSizeParam={pageSizeParam}
            action={action}
            urlParams={searchParams}
          />
        </div>
      </div>
    </main>
  );
}
