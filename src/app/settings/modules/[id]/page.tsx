import getModuleByIdQuery from "@/repositories/modules/queries/getModuleByIdQuery";
import ModuleForm from "@/components/modules/moduleForm";
import frFR from "@/lang/fr-FR";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { action: string };
}) {
  const t = frFR;
  let module;
  const action = searchParams.action?.replace(/"/g, "");

  if (params.id != "create") {
    module = await getModuleByIdQuery(Number(params.id));
  } else {
    module = null;
  }

  const pagetitle = `${`${t.shared[action as keyof typeof t.shared]} ${t.modules.module} 
    ${action != "create" ? `: ${module ? module.Name : ""}` : ""}`}`;

  return (
    <div className="mt-5 flex justify-center">
      <div className="mt-3 w-[50vw] rounded-md border bg-muted/60 p-5 shadow-md">
        <div className="flex items-center justify-between text-lg font-medium">
          {pagetitle}
        </div>
        <div className="mt-5">
          <ModuleForm moduleData={module} action={action} />
        </div>
        {/* <pre>{JSON.stringify(module, null, 2)}</pre> */}
      </div>
    </div>
  );
}
