"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Students } from "@prisma/client";

export default function StudentsTable({
  studentsData,
}: {
  studentsData: Students[];
}) {
  // const columnHelper = createColumnHelper<User>();

  const columns = useMemo<ColumnDef<Students, any>[]>(
    () => [
      {
        accessorKey: "StudentId",
        id: "StudentId",
        // cell: (info) => info.getValue(),
        header: () => <Header text="StudentId" />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "PersonId",
        id: "PersonId",
        // cell: (info) => info.getValue(),
        header: () => <Header text="PersonId" />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "StudentTypeId",
        id: "StudentTypeId",
        // cell: (info) => info.getValue(),
        header: () => <Header text="StudentTypeId" />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsACA",
        id: "IsACA",
        cell: (info) => info.getValue(),
        header: () => <Header text="IsACA" />,
        filterFn: "includesStringSensitive",
      },
    ],
    [],
  );

  return (
    <main className="">
      <Table columns={columns} data={studentsData} className="" />
    </main>
  );
}
