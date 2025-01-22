import getRoleModuleElementByIdQuery from "@/repositories/roleModuleElements/queries/getRoleModuleElementByIdQuery";
import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import getAllModuleElementsQuery from "@/repositories/moduleElements/queries/getAllModuleElementsQuery";
import getAllRolesQuery from "@/repositories/roles/queries/getAllRolesQuery";
import RoleModuleElementForm from "@/components/roleModuleElements/roleModuleElementsForm";
import frFR from "@/lang/fr-FR";

export default async function RoleModuleElementPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let roleModuleElement;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    roleModuleElement = await getRoleModuleElementByIdQuery(Number(params.id));
  } else {
    roleModuleElement = null;
  }

  const modules = await getAllModulesQuery();
  const moduleElements = await getAllModuleElementsQuery();
  const roles = await getAllRolesQuery();

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.roleModuleElements.roleModuleElement} 
    ${action != "create" ? `: ${roleModuleElement ? roleModuleElement.RoleModuleElementId : ""}` : ""}`}`;

  return (
    <div className="flex justify-center pb-7 pt-3">
      <div className="w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <RoleModuleElementForm
            roleModuleElementData={roleModuleElement}
            modules={modules}
            moduleElements={moduleElements}
            roles={roles}
            action={action}
          />
        </div>
        {/* <pre>{JSON.stringify(module, null, 2)}</pre> */}
      </div>
    </div>
  );
}
