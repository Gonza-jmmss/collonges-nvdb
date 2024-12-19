import UsersTable from "./usersTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllUsersQuery } from "@/repositories/users/queries/getAllUsersQuery";
import frFR from "@/lang/fr-FR";

export default async function UsersPage() {
  const t = frFR;

  const usersQuery = new getAllUsersQuery();
  const users = await usersQuery.execute();

  return (
    <main className="mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.users.pageTitle}</span>
        <Button asChild variant="outlineColored">
          <Link
            href={`/settings/users/null?action="create"`}
            className="flex flex-col space-y-2"
          >
            <span>{t.users.create}</span>
          </Link>
        </Button>
      </div>
      <UsersTable usersData={users} />
    </main>
  );
}
