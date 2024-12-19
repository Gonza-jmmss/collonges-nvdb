import { getUserByUserIdQuery } from "@/repositories/users/queries/getUserByUserIdQuery";
import { getAllRolesQuery } from "@/repositories/roles/queries/getAllRolesQuery";
import UserForm from "@/components/users/userForm";
import frFR from "@/lang/fr-FR";

export default async function UserPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let user;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "null") {
    const userQuery = new getUserByUserIdQuery();
    user = await userQuery.execute(Number(params.id));
  } else {
    user = null;
  }

  const rolesQuery = new getAllRolesQuery();
  const roles = await rolesQuery.execute();

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.users.user} 
    ${action != "create" ? `: ${user ? user.UserName : ""}` : ""}`}`;

  return (
    <main className="mt-5 flex justify-center">
      <div className="mt-3 w-[50vw]">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <UserForm userData={user} action={action} roles={roles} />
        </div>
      </div>
    </main>
  );
}
