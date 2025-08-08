"use server";

// import SidebarComponent from "./sidebar/sidebarComponent";
import SidebarComponent from "@/components/sidebar/sidebarComponent";
import getAllModulesByRoleIdQuery from "@/repositories/roleModuleElements/queries/getAllModulesByRoleIdQuery";
import getShortcutRoleModuleElementsByRoleQuery from "@/repositories/roleModuleElements/queries/getShortcutRoleModuleElementsByRoleQuery";
import getModuleElementsByModuleIdQuery from "@/repositories/moduleElements/queries/getModuleElementsByModuleIdQuery";
import { ModulesViewModel } from "@/repositories/modules/modulesViewModel";
import { ShortcutRoleModuleElementsViewModel } from "@/repositories/roleModuleElements/roleModuleElementsViewModel";
import { ModuleElementsByModelIdViewModel } from "@/repositories/moduleElements/moduleElementsViewModel";
import { auth } from "@/utils/auth";

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let modules: ModulesViewModel[] = [];
  let studentModuleElements: ModuleElementsByModelIdViewModel[] = [];
  let shortcuts: ShortcutRoleModuleElementsViewModel[] = [];

  if (session) {
    modules = await getAllModulesByRoleIdQuery(session.user.userData.RoleId);
    studentModuleElements = await getModuleElementsByModuleIdQuery({
      ModuleId:
        modules.find((x) => x.Name === "Accueil étudiant")?.ModuleId || 0,
    });
    shortcuts = await getShortcutRoleModuleElementsByRoleQuery({
      RoleId: session.user.userData.RoleId,
    });
  }

  return (
    <SidebarComponent
      modules={modules}
      studentModuleElements={studentModuleElements}
      session={session}
      shortcuts={shortcuts}
    >
      {children}
    </SidebarComponent>
  );
}
