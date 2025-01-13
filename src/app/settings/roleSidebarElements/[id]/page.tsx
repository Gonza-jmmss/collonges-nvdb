import getRoleSidebarElementByIdQuery from "@/repositories/roleSidebarElements/queries/getRoleSidebarElementByIdQuery";
import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import getAllSidebarElementsQuery from "@/repositories/sidebarElements/queries/getAllSidebarElementsQuery";
import getAllRolesQuery from "@/repositories/roles/queries/getAllRolesQuery";
import RoleSidebarElementForm from "@/components/roleSidebarElements/roleSidebarElementsForm";
import frFR from "@/lang/fr-FR";

export default async function RoleSidebarElementPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let roleSidebarElement;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    roleSidebarElement = await getRoleSidebarElementByIdQuery(
      Number(params.id),
    );
  } else {
    roleSidebarElement = null;
  }

  const modules = await getAllModulesQuery();
  const sidebarElements = await getAllSidebarElementsQuery();
  const roles = await getAllRolesQuery();

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.roleSidebarElements.roleSidebarElement} 
    ${action != "create" ? `: ${roleSidebarElement ? roleSidebarElement.RoleSidebarElementId : ""}` : ""}`}`;

  return (
    <div className="flex justify-center pb-7 pt-3">
      <div className="w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <RoleSidebarElementForm
            roleSidebarElementData={roleSidebarElement}
            modules={modules}
            sidebarElements={sidebarElements}
            roles={roles}
            action={action}
          />
        </div>
        {/* <pre>{JSON.stringify(module, null, 2)}</pre> */}
      </div>
    </div>
  );
}
