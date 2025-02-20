import getRoleByRoleIdQuery from "@/repositories/roles/queries/getRoleByRoleIdQuery";
import RoleForm from "@/components/roles/roleForm";
import frFR from "@/lang/fr-FR";

export default async function RolePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let role;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    role = await getRoleByRoleIdQuery(Number(params.id));
    // role = await roleQuery.execute(Number(params.id));
  } else {
    role = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.roles.role} 
    ${action != "create" ? `: ${role ? role.Name : ""}` : ""}`}`;

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <RoleForm roleData={role} action={action} />
        </div>
        {/* <pre>{JSON.stringify(role, null, 2)}</pre> */}
      </div>
    </div>
  );
}
