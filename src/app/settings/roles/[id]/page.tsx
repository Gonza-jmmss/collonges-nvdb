import getRoleByRoleIdQuery from "@/repositories/roles/queries/getRoleByRoleIdQuery";
import RoleForm from "@/components/roles/roleForm";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import frFR from "@/lang/fr-FR";

export default async function RolePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  let role;
  const action =
    searchParams?.action && (searchParams.action as string).replace(/"/g, "");

  const isEnabledParam =
    searchParams.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  if (params.id != "create") {
    role = await getRoleByRoleIdQuery(Number(params.id));
    // role = await roleQuery.execute(Number(params.id));
  } else {
    role = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.roles.role} 
    ${action != "create" ? `: ${role ? role.Name : ""}` : ""}`}`;

  return (
    <main className="relative mt-5 flex justify-center">
      <Button asChild className={`absolute -left-16 top-3`} variant="ghost">
        <Link href={`/settings/roles?isEnabled=${isEnabledParam}`}>
          <Icon name={"MdArrowBack"} className="text-xl" />
        </Link>
      </Button>
      <div className="mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <RoleForm roleData={role} action={action} urlParams={searchParams} />
        </div>
        {/* <pre>{JSON.stringify(role, null, 2)}</pre> */}
      </div>
    </main>
  );
}
