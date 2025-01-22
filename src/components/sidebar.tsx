"use server";

import SidebarComponent from "./sidebar/sidebarComponent";
import getAllModulesByRoleIdQuery from "@/repositories/roleModuleElements/queries/getAllModulesByRoleIdQuery";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { auth } from "@/utils/auth";

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let modules: ModulesViewModel[] = [];

  if (session) {
    modules = await getAllModulesByRoleIdQuery(session.user.userData.RoleId);
  }

  return (
    <SidebarComponent modules={modules} session={session}>
      {children}
    </SidebarComponent>
  );
}
