"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { UsersViewModel } from "@/repositories/users/usersViewModel";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function UsersTable({
  usersData,
}: {
  usersData: UsersViewModel[];
}) {
  const t = frFR;
  const router = useRouter();

  const columns = useMemo<ColumnDef<UsersViewModel, any>[]>(
    () => [
      {
        accessorKey: "UserId",
        id: "UserId",
        header: () => <Header text={t.users.columns.userId} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => <Header text={t.users.columns.userName} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.student.columns.actions} />,
        size: 50,
        cell: () => (
          <div className="flex space-x-1">
            <Icon
              name={
                isValidIconName("MdEdit") ? "MdEdit" : "MdOutlineNotInterested"
              }
              className="cursor-pointer text-xl"
            />
            <Icon
              name={
                isValidIconName("MdDelete")
                  ? "MdDelete"
                  : "MdOutlineNotInterested"
              }
              className="cursor-pointer text-xl"
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <main className="">
      <Table
        columns={columns}
        data={usersData}
        className=""
        onRowClick={(row) => router.push(`/settings/users/${row.UserId}`)}
      />
    </main>
  );
}
