import RoleSidebarElementsTable from "./roleSidebarElementsTable";
import getAllRoleSidebarElementsQuery from "@/repositories/roleSidebarElements/queries/getAllRoleSidebarElementsQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default async function RoleSidebarElementsPage() {
  const t = frFR;

  const roleSidebarElements = await getAllRoleSidebarElementsQuery();

  return (
    <main className="mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">
          {t.roleSidebarElements.title}
        </span>
        <Button asChild variant="outlineColored">
          <Link
            href={`/settings/roleSidebarElements/create?action="create"`}
            className="flex flex-col space-y-2"
          >
            <span>{t.roleSidebarElements.create}</span>
          </Link>
        </Button>
      </div>
      <RoleSidebarElementsTable roleSidebarElementsData={roleSidebarElements} />
      {/* <pre>{JSON.stringify(SidebarElements, null, 2)}</pre> */}
    </main>
  );
}
