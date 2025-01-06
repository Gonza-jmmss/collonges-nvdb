import getUserByUserIdQuery from "@/repositories/users/queries/getUserByUserIdQuery";
import getAllRolesQuery from "@/repositories/roles/queries/getAllRolesQuery";
import UserForm from "@/components/users/userForm";
import { SidePanel } from "@/components/common/sidePanel";
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

  if (params.id != "create") {
    user = await getUserByUserIdQuery(Number(params.id));
  } else {
    user = null;
  }

  const roles = await getAllRolesQuery();

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.users.user} 
    ${action != "create" ? `: ${user ? user.UserName : ""}` : ""}`}`;

  return (
    <SidePanel>
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
    </SidePanel>
  );
}
