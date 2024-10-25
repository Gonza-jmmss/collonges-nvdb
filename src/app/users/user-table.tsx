"use client";

// import { useState, useEffect } from "react";
// import { User } from "@/db/schema/user";
// import { createColumnHelper } from "@tanstack/react-table";
// import Table from "@/components/table/table";
// import Header from "@/components/table/header";

// export default function UserTable({ userData }: { userData: User[] }) {
//   const columnHelper = createColumnHelper<User>();

//   const columns = [
//     columnHelper.accessor("id", {
//       id: "id",
//       // cell: (info) => info.getValue(),
//       header: () => <Header text="Id" />,
//     }),
//     columnHelper.accessor("name", {
//       id: "name",
//       cell: (info) => info.getValue(),
//       header: () => <Header text="Name" />,
//     }),
//     columnHelper.accessor("role", {
//       id: "role",
//       cell: (info) => info.getValue(),
//       header: () => <Header text="Role" />,
//     }),
//   ];

//   return (
//     <main className="">
//       <Table columns={columns} data={userData} className="w" />
//     </main>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { User } from "@/db/schema/user";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";

export default function UserTable({ userData }: { userData: User[] }) {
  // const columnHelper = createColumnHelper<User>();

  const columns = useMemo<ColumnDef<User, any>[]>(
    () => [
      {
        accessorKey: "id",
        id: "id",
        // cell: (info) => info.getValue(),
        header: () => <Header text="Id" />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "name",
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <Header text="Name" />,
        filterFn: 'includesStringSensitive',
      },
      {
        accessorKey: "role",
        id: "role",
        cell: (info) => info.getValue(),
        header: () => <Header text="Role" />,
        filterFn: 'includesStringSensitive',
      },
    ],
    [],
  );

  return (
    <main className="">
      <Table columns={columns} data={userData} className="" />
    </main>
  );
}
