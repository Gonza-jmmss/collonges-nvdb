import UsersTable from "./usersTable";
import getAllUsersQuery from "@/repositories/users/queries/getAllUsersQuery";
import frFR from "@/lang/fr-FR";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const pageIndex = searchParams?.pageIndex
    ? parseInt(searchParams.pageIndex as string)
    : 0;
  const pageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 10;

  const isEnabledParam =
    searchParams?.isEnabled === undefined
      ? true
      : searchParams.isEnabled === "true";

  const isStudentParam =
    searchParams?.isStudent === undefined
      ? false
      : searchParams.isStudent === "true";

  const users = await getAllUsersQuery({
    IsEnabled: isEnabledParam,
    IsStudent: isStudentParam,
  });

  return (
    <main className="relative mt-3 w-[80vw]">
      <div className="flex justify-between space-x-3">
        <span className="text-xl font-semibold">{t.users.pageTitle}</span>
      </div>
      <UsersTable
        usersData={users}
        isEnabledSelected={isEnabledParam}
        isStudentSelected={isStudentParam}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </main>
  );
}
