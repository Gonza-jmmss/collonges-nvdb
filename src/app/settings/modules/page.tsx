import ModulesTable from "./modulesTable";
import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default async function ModulesPage() {
  const t = frFR;

  const modules = await getAllModulesQuery();

  return (
    <main className="mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.modules.title}</span>
        <Button asChild variant="outlineColored">
          <Link
            href={`/settings/modules/create?action="create"`}
            className="flex flex-col space-y-2"
          >
            <span>{t.modules.create}</span>
          </Link>
        </Button>
      </div>
      <ModulesTable modulesData={modules} />
      {/* <pre>{JSON.stringify(modules, null, 2)}</pre> */}
    </main>
  );
}
