import { db } from "@/db/client";
import { usersTable } from "@/db/schema/user";
import UserTable from "./user-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import enUS from "@/lang/en-US";

export default async function Users() {
  const t = enUS;
  const users = await db.select().from(usersTable);

  // const newUser = {
  //   name:'Jodas',
  //   role: 'admin'
  // }

  // const validUser = insertUserSchema.parse(newUser)

  // console.log(validUser)

  return (
    <main className="">
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-end space-x-3">
          <Button>
            <Link
              href={{
                pathname: `/users/undefined`,
              }}
            >
              {t.user.create}
            </Link>
          </Button>
        </div>
        <UserTable userData={users} />
      </div>
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </main>
  );
}
