import ModuleElementsTable from "./moduleElementsTable";
import getAllModuleElementsQuery from "@/repositories/moduleElements/queries/getAllModuleElementsQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default async function ModuleElementsPage() {
  const t = frFR;

  const moduleElements = await getAllModuleElementsQuery();

  return (
    <main className="mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.moduleElements.title}</span>
        <Button asChild variant="outlineColored">
          <Link
            href={`/settings/moduleElements/create?action="create"`}
            className="flex flex-col space-y-2"
          >
            <span>{t.moduleElements.create}</span>
          </Link>
        </Button>
      </div>
      <ModuleElementsTable moduleElementsData={moduleElements} />
      {/* <pre>{JSON.stringify(moduleElements, null, 2)}</pre> */}
    </main>
  );
}
