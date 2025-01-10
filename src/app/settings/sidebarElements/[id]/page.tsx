import getSidebarElementByIdQuery from "@/repositories/sidebarElements/queries/getSidebarElementById.Query";
import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import SidebarElementForm from "@/components/sidebarElement/sidebarElementForm";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let sidebarElement;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    sidebarElement = await getSidebarElementByIdQuery(Number(params.id));
  } else {
    sidebarElement = null;
  }

  const modules = await getAllModulesQuery();

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.sidebarElements.sidebarElement} 
    ${action != "create" ? `: ${sidebarElement ? sidebarElement.Name : ""}` : ""}`}`;

  return (
    <div className="flex justify-center pb-7 pt-3">
      <div className="w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <SidebarElementForm
            sidebarElementData={sidebarElement}
            modules={modules}
            action={action}
          />
        </div>
        {/* <pre>{JSON.stringify(module, null, 2)}</pre> */}
      </div>
    </div>
  );
}
