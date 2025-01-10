import SidebarElementsTable from "./sidebarElementsTable";
import getAllSidebarElementsQuery from "@/repositories/sidebarElements/queries/getAllSidebarElementsQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default async function SidebarElementsPage() {
  const t = frFR;

  const sidebarElements = await getAllSidebarElementsQuery();

  return (
    <main className="mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.sidebarElements.title}</span>
        <Button asChild variant="outlineColored">
          <Link
            href={`/settings/sidebarElements/create?action="create"`}
            className="flex flex-col space-y-2"
          >
            <span>{t.sidebarElements.create}</span>
          </Link>
        </Button>
      </div>
      <SidebarElementsTable sidebarElementsData={sidebarElements} />
      {/* <pre>{JSON.stringify(SidebarElements, null, 2)}</pre> */}
    </main>
  );
}
