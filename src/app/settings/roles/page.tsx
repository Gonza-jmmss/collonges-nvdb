import RolesTable from "./rolesTable";
import getAllRolesQuery from "@/repositories/roles/queries/getAllRolesQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default async function RolesPage() {
  const t = frFR;

  const roles = await getAllRolesQuery();
  // const roles = await rolesQuery.execute();

  return (
    <main className="mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.roles.pageTitle}</span>
        <Button asChild variant="outlineColored">
          <Link
            href={`/settings/roles/create?action="create"`}
            className="flex flex-col space-y-2"
          >
            <span>{t.roles.create}</span>
          </Link>
        </Button>
      </div>
      <RolesTable rolesData={roles} />
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </main>
  );
}
