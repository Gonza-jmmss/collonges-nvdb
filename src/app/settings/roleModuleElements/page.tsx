import RoleModuleElementsTable from "./roleModuleElementsTable";
import getAllRoleModuleElementsQuery from "@/repositories/roleModuleElements/queries/getAllRoleModuleElementsQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default async function RoleModuleElementsPage() {
  const t = frFR;

  const roleModuleElements = await getAllRoleModuleElementsQuery();

  return (
    <main className="mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">
          {t.roleModuleElements.title}
        </span>
        <Button asChild variant="outlineColored">
          <Link
            href={`/settings/roleModuleElements/create?action="create"`}
            className="flex flex-col space-y-2"
          >
            <span>{t.roleModuleElements.create}</span>
          </Link>
        </Button>
      </div>
      <RoleModuleElementsTable roleModuleElementsData={roleModuleElements} />
      {/* <pre>{JSON.stringify(roleModuleElements, null, 2)}</pre> */}
    </main>
  );
}
